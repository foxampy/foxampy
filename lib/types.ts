/**
 * Типы строк — точная копия реальной схемы Supabase-проекта hbnuxcdrdtzotlxaskwp.
 * Проверено через information_schema, не придумано.
 *
 * Источники:
 *   migration 20261008052526 sales_funnel_schema  → contacts, outreach_log, proposals, bot_users, bot_events
 *   migration 20261008052541 campaign_stats_view   → VIEW campaign_stats
 *   bot-dmitry/supabase/001_dm_leads.sql           → dm_leads
 */

/** VIEW public.campaign_stats — одна строка, без campaign_id и без updated_at. */
export interface CampaignStats {
  total_contacts: number
  /** contacts.status = 'new' */
  queued: number
  /** contacts.status = 'contacted' */
  contacted: number
  /** contacts.status = 'engaged' */
  engaged: number
  /** contacts.status = 'client' */
  clients: number
  /** count(*) из outreach_log */
  outreach_sent: number
  bot_users: number
  bot_users_active_7d: number
  proposals_sent: number
  won_mrr_usd: number
  pipeline_mrr_usd: number
  /** Уже в процентах, одна цифра после запятой. */
  response_rate_pct: number
}

export const EMPTY_STATS: CampaignStats = {
  total_contacts: 0,
  queued: 0,
  contacted: 0,
  engaged: 0,
  clients: 0,
  outreach_sent: 0,
  bot_users: 0,
  bot_users_active_7d: 0,
  proposals_sent: 0,
  won_mrr_usd: 0,
  pipeline_mrr_usd: 0,
  response_rate_pct: 0,
}

/** public.contacts. Внимание: full_name, а не name. */
export interface Contact {
  id: string
  full_name: string | null
  company: string | null
  position: string | null
  industry: string | null
  email: string | null
  phone: string | null
  telegram: string | null
  linkedin_url: string | null
  city: string | null
  employee_count: number | null
  source: string
  confidence_score: number
  /** Свободный текст. Вью различает 'new' | 'contacted' | 'engaged' | 'client'. */
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

/** public.outreach_log. Нет полей opened_at / clicked_at — трекинга открытий в схеме нет. */
export interface OutreachLogRow {
  id: string
  contact_id: string | null
  channel: string
  template_id: string | null
  message: string | null
  sent_by: string
  outcome: string
  sent_at: string
}

/** public.dm_leads (бот @architectsadikov / bot-dmitry). */
export interface DmLead {
  id: number
  created_at: string
  telegram_id: number
  username: string | null
  full_name: string
  company: string | null
  request: string
  status: string
  source: string
}

// ─── Формы агрегатов, которые возвращают роуты ─────────────────────────────

export interface NameValue {
  name: string
  value: number
}

export interface DayPoint {
  /** ISO-дата YYYY-MM-DD */
  day: string
  /** Подпись для оси X, напр. «08.10» */
  label: string
  sent: number
}

export interface StatsPayload {
  stats: CampaignStats
  /** Распределение dm_leads по status. Пусто, если лидов нет. */
  leadsByStatus: NameValue[]
  leadsTotal: number
}

export interface AnalyticsPayload {
  /** Отправки по дням за последние 14 дней. Пусто, если outreach_log пуст. */
  timeline: DayPoint[]
  /** Группировка outreach_log по channel. */
  byChannel: NameValue[]
  /** Группировка outreach_log по outcome. */
  byOutcome: NameValue[]
  /** Группировка dm_leads по source. */
  leadsBySource: NameValue[]
  outreachTotal: number
}
