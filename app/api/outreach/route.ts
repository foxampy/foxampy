/**
 * POST /api/outreach — регистрация факта ручного касания.
 *
 * Пишет в реальные таблицы:
 *   public.contacts     — находит контакт по email (есть уникальный индекс
 *                         contacts_email_uniq на lower(email)) или создаёт новый;
 *   public.outreach_log — строку касания (channel NOT NULL, outcome DEFAULT 'sent');
 *   public.contacts     — переводит status в 'contacted', чтобы контакт ушёл
 *                         из очереди и попал в соответствующий столбец воронки.
 */

import { getDb, ok, fail } from '@/lib/supabase-server'
import type { Contact } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Значения channel — свободный текст в схеме, но фиксируем список на входе. */
const CHANNELS = ['telegram', 'email', 'linkedin', 'phone', 'in_person'] as const
type Channel = (typeof CHANNELS)[number]

interface Body {
  contactId?: string
  fullName?: string
  company?: string
  email?: string
  telegram?: string
  channel?: string
  templateId?: string
  message?: string
}

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

export async function POST(request: Request): Promise<Response> {
  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return fail('Некорректный JSON в теле запроса.', 400)
  }

  const channel = clean(body.channel)
  if (channel === null || !CHANNELS.includes(channel as Channel)) {
    return fail(`channel обязателен и должен быть одним из: ${CHANNELS.join(', ')}.`, 400)
  }

  const fullName = clean(body.fullName)
  const email = clean(body.email)?.toLowerCase() ?? null
  const telegram = clean(body.telegram)
  const company = clean(body.company)
  const templateId = clean(body.templateId)
  const message = clean(body.message)
  const contactId = clean(body.contactId)

  if (contactId === null && fullName === null) {
    return fail('Нужно либо выбрать контакт из очереди, либо указать имя.', 400)
  }

  try {
    const db = getDb()
    let resolvedId = contactId

    // Контакт не выбран из очереди — ищем по email, иначе создаём новый.
    if (resolvedId === null) {
      if (email !== null) {
        const existing = await db
          .from('contacts')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (existing.error !== null) return fail(`contacts: ${existing.error.message}`)
        resolvedId = (existing.data as Pick<Contact, 'id'> | null)?.id ?? null
      }

      if (resolvedId === null) {
        const created = await db
          .from('contacts')
          .insert({
            full_name: fullName,
            company,
            email,
            telegram,
            source: 'miniapp-manual',
            status: 'new',
          })
          .select('id')
          .single()
        if (created.error !== null) return fail(`contacts: ${created.error.message}`)
        resolvedId = (created.data as Pick<Contact, 'id'>).id
      }
    }

    const logged = await db
      .from('outreach_log')
      .insert({
        contact_id: resolvedId,
        channel,
        template_id: templateId,
        message,
        sent_by: 'timur',
        outcome: 'sent',
      })
      .select('id, sent_at')
      .single()
    if (logged.error !== null) return fail(`outreach_log: ${logged.error.message}`)

    const moved = await db
      .from('contacts')
      .update({ status: 'contacted', updated_at: new Date().toISOString() })
      .eq('id', resolvedId)
    if (moved.error !== null) return fail(`contacts: ${moved.error.message}`)

    return ok({ contactId: resolvedId, outreach: logged.data })
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Неизвестная ошибка')
  }
}
