/**
 * GET /api/leads — последние лиды из Telegram-бота.
 * Источник: TABLE public.dm_leads (её наполняет bot-dmitry/src/db.ts saveLead).
 */

import { getDb, ok, fail } from '@/lib/supabase-server'
import type { DmLead } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LIMIT = 20

export async function GET(): Promise<Response> {
  try {
    const { data, error } = await getDb()
      .from('dm_leads')
      .select('id, created_at, username, full_name, company, request, status, source')
      .order('created_at', { ascending: false })
      .limit(LIMIT)

    if (error !== null) return fail(`dm_leads: ${error.message}`)

    return ok((data ?? []) as Omit<DmLead, 'telegram_id'>[])
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Неизвестная ошибка')
  }
}
