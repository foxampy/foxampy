/**
 * GET /api/analytics — всё, что реально можно посчитать по схеме.
 *
 * Источники:
 *   TABLE public.outreach_log — sent_at, channel, outcome (других полей нет:
 *     трекинга открытий/кликов в схеме НЕ существует, поэтому open-rate и CTR
 *     здесь не считаются и нигде не показываются);
 *   TABLE public.dm_leads     — source.
 */

import { getDb, ok, fail } from '@/lib/supabase-server'
import type { AnalyticsPayload, DayPoint, NameValue, OutreachLogRow } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const TIMELINE_DAYS = 14

const OUTCOME_LABELS: Record<string, string> = {
  sent: 'Отправлено',
  replied: 'Ответили',
  meeting: 'Встреча',
  rejected: 'Отказ',
  no_reply: 'Без ответа',
}

function tally(rows: string[], labels: Record<string, string> = {}): NameValue[] {
  const counts = new Map<string, number>()
  for (const raw of rows) {
    const key = raw.trim().length === 0 ? '—' : raw
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([key, value]) => ({ name: labels[key] ?? key, value }))
    .sort((a, b) => b.value - a.value)
}

/** Ровно TIMELINE_DAYS подряд идущих дней, чтобы в графике не было дыр. */
function buildTimeline(sentAt: string[]): DayPoint[] {
  const counts = new Map<string, number>()
  for (const iso of sentAt) {
    const day = iso.slice(0, 10)
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }

  const out: DayPoint[] = []
  const cursor = new Date()
  cursor.setUTCHours(0, 0, 0, 0)
  cursor.setUTCDate(cursor.getUTCDate() - (TIMELINE_DAYS - 1))

  for (let i = 0; i < TIMELINE_DAYS; i++) {
    const day = cursor.toISOString().slice(0, 10)
    out.push({
      day,
      label: `${day.slice(8, 10)}.${day.slice(5, 7)}`,
      sent: counts.get(day) ?? 0,
    })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return out
}

export async function GET(): Promise<Response> {
  try {
    const db = getDb()

    const since = new Date()
    since.setUTCHours(0, 0, 0, 0)
    since.setUTCDate(since.getUTCDate() - (TIMELINE_DAYS - 1))

    const [recent, all, leads] = await Promise.all([
      db.from('outreach_log').select('sent_at').gte('sent_at', since.toISOString()),
      db.from('outreach_log').select('channel, outcome'),
      db.from('dm_leads').select('source'),
    ])

    if (recent.error !== null) return fail(`outreach_log: ${recent.error.message}`)
    if (all.error !== null) return fail(`outreach_log: ${all.error.message}`)
    if (leads.error !== null) return fail(`dm_leads: ${leads.error.message}`)

    const recentRows = (recent.data ?? []) as Pick<OutreachLogRow, 'sent_at'>[]
    const allRows = (all.data ?? []) as Pick<OutreachLogRow, 'channel' | 'outcome'>[]
    const leadRows = (leads.data ?? []) as { source: string }[]

    const payload: AnalyticsPayload = {
      // Пустой массив, а не нулевая линия, если отправок не было вообще —
      // компонент покажет честное «данных пока нет».
      timeline: allRows.length === 0 ? [] : buildTimeline(recentRows.map((r) => r.sent_at)),
      byChannel: tally(allRows.map((r) => r.channel)),
      byOutcome: tally(
        allRows.map((r) => r.outcome),
        OUTCOME_LABELS,
      ),
      leadsBySource: tally(leadRows.map((r) => r.source)),
      outreachTotal: allRows.length,
    }

    return ok(payload)
  } catch (err) {
    return fail(err instanceof Error ? err.message : 'Неизвестная ошибка')
  }
}
