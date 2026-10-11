'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import Empty from '@/components/Empty'
import type { StatsPayload } from '@/lib/types'

/**
 * Обзор. Все цифры приходят из VIEW public.campaign_stats и TABLE public.dm_leads.
 *
 * Демо-массив timelineData удалён: он показывал выдуманную недельную активность.
 * Реальная активность по дням считается из outreach_log.sent_at и живёт
 * на вкладке «Аналитика» (/api/analytics).
 */
export default function CampaignStats({ payload }: { payload: StatsPayload }) {
  const { stats, leadsByStatus, leadsTotal } = payload

  const funnel = [
    { name: 'Новые', value: stats.queued },
    { name: 'Контакт', value: stats.contacted },
    { name: 'Интерес', value: stats.engaged },
    { name: 'Клиенты', value: stats.clients },
  ]

  const funnelHasData = funnel.some((s) => s.value > 0)
  const money = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })

  return (
    <div>
      <section className="section">
        <div className="metric-grid">
          <div className="metric">
            <p className="metric-label">В очереди</p>
            <p className="metric-value">{stats.queued}</p>
            <p className="metric-hint">contacts.status = new</p>
          </div>
          <div className="metric">
            <p className="metric-label">Касания</p>
            <p className="metric-value">{stats.outreach_sent}</p>
            <p className="metric-hint">всего строк в outreach_log</p>
          </div>
          <div className="metric">
            <p className="metric-label">Интерес</p>
            <p className="metric-value">{stats.engaged}</p>
            <p className="metric-hint">contacts.status = engaged</p>
          </div>
          <div className="metric">
            <p className="metric-label">Отклик</p>
            <p className="metric-value">{Number(stats.response_rate_pct).toFixed(1)}%</p>
            <p className="metric-hint">(интерес + клиенты) / касания</p>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-label">Воронка по статусам контактов</p>
        {funnelHasData ? (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={funnel} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="name"
                axisLine={{ stroke: '#ededed' }}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8a8a8a' }}
              />
              <Tooltip
                contentStyle={{ border: 'none', boxShadow: 'none', fontSize: 12 }}
                formatter={(value: number) => [value, 'контактов']}
              />
              <Bar dataKey="value" radius={0}>
                {funnel.map((entry) => (
                  <Cell key={entry.name} fill="#00AEEF" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty>В таблице contacts пока нет ни одной строки</Empty>
        )}
      </section>

      <section className="section">
        <p className="section-label">Лиды из Telegram-бота</p>
        {leadsTotal === 0 ? (
          <Empty>В таблице dm_leads пока нет ни одной заявки</Empty>
        ) : (
          <ul>
            {leadsByStatus.map((item) => (
              <li key={item.name} className="row flex items-baseline justify-between">
                <span className="text-[15px] text-neutral-700">{item.name}</span>
                <span className="text-[15px] font-semibold tabular-nums">{item.value}</span>
              </li>
            ))}
            <li className="row flex items-baseline justify-between border-b-0">
              <span className="text-[15px] font-medium text-neutral-900">Всего</span>
              <span className="text-[15px] font-semibold tabular-nums">{leadsTotal}</span>
            </li>
          </ul>
        )}
      </section>

      <section className="section">
        <p className="section-label">Бот и предложения</p>
        <div className="metric-grid">
          <div className="metric">
            <p className="metric-label">Пользователи бота</p>
            <p className="metric-value">{stats.bot_users}</p>
            <p className="metric-hint">активны за 7 дней: {stats.bot_users_active_7d}</p>
          </div>
          <div className="metric">
            <p className="metric-label">КП отправлено</p>
            <p className="metric-value">{stats.proposals_sent}</p>
            <p className="metric-hint">proposals.status ≠ draft</p>
          </div>
          <div className="metric">
            <p className="metric-label">Закрыто, $</p>
            <p className="metric-value">{money.format(Number(stats.won_mrr_usd))}</p>
            <p className="metric-hint">proposals.status = accepted</p>
          </div>
          <div className="metric">
            <p className="metric-label">В работе, $</p>
            <p className="metric-value">{money.format(Number(stats.pipeline_mrr_usd))}</p>
            <p className="metric-hint">sent + negotiating</p>
          </div>
        </div>
      </section>
    </div>
  )
}
