/**
 * GET /api/stats — сводка по воронке.
 *
 * Источники (реальные объекты в базе):
 *   VIEW public.campaign_stats — одна строка агрегатов по contacts / outreach_log /
 *                                bot_users / proposals;
 *   TABLE public.dm_leads      — лиды из Telegram-бота, разбивка по status.
 */

import { getDb, ok, fail } from '@/lib/supabase-server'
import type { CampaignStats, DmLead, NameValue, StatsPayload } from '@/lib/types'
import { EMPTY_STATS } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const LEAD_STATUS_LABELS: Record<string, string> = {
  new: 'Новые',
  contacted: 'В работе',
  closed: 'Закрыты',
}

export async function GET(): Promise<Response> {
  try {
    const db = getDb()

    // campaign_stats — вью без ключа, всегда ровно одна строка.
    const statsRes = await db.from('campaign_stats').select('*').maybeSingle()
    if (statsRes.error !== null) {
      return fail(`campaign_stats: ${statsRes.error.message}`)
    }

    const leadsRes = await db.from('dm_leads').select('status')
    if (leadsRes.error !== null) {
      return fail(`dm_leads: ${leadsRes.error.message}`)
    }

    const leadRows = (leadsRes.data ?? []) as Pick<DmLead, 'status'>[]
    const counts = new Map<string, number>()
    for (const row of leadRows) {
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1)
    }

    const leadsByStatus: NameValue[] = [...counts.entries()]
      .map(([status, value]) => ({ name: LEAD_STATUS_LABELS[status] ?? status, value }))
      .sort((a, b) => b.value - a.value)

    const payload: StatsPayload = {
      stats: (statsRes.data as CampaignStats | null) ?? EMPTY_STATS,
      leadsByStatus,
      leadsTotal: leadRows.length,
    }

    return ok(payload)
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Неизвестная ошибка')
  }
}
