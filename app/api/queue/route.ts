/**
 * GET /api/queue — контакты, с которыми ещё не связывались.
 *
 * Источник: TABLE public.contacts, status = 'new' (именно это значение вью
 * campaign_stats считает как «queued»; строки 'queued' в схеме не бывает —
 * DEFAULT у колонки 'new').
 */

import { getDb, ok, fail } from '@/lib/supabase-server'
import type { Contact } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const QUEUE_LIMIT = 30

const QUEUE_COLUMNS =
  'id, full_name, company, position, industry, email, telegram, linkedin_url, city, source, confidence_score, status, created_at'

export async function GET(): Promise<Response> {
  try {
    const { data, error } = await getDb()
      .from('contacts')
      .select(QUEUE_COLUMNS)
      .eq('status', 'new')
      .order('confidence_score', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(QUEUE_LIMIT)

    if (error !== null) return fail(`contacts: ${error.message}`)

    return ok((data ?? []) as Partial<Contact>[])
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Неизвестная ошибка')
  }
}
