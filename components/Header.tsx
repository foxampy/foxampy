import type { CampaignStats } from '@/lib/types'

/**
 * Шапка. Плоская: без градиента, без полупрозрачных плиток —
 * только типографика и одна разделительная линия снизу.
 */
export default function Header({ stats }: { stats: CampaignStats }) {
  return (
    <header className="border-b border-neutral-200 px-4 pb-5 pt-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
          UNICAP
        </p>
        <h1 className="mt-1 text-xl font-semibold text-neutral-900">Воронка продаж</h1>

        <div className="mt-5 flex items-baseline gap-6">
          <div>
            <p className="metric-label">Контакты</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">
              {stats.total_contacts}
            </p>
          </div>
          <div>
            <p className="metric-label">Касания</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">
              {stats.outreach_sent}
            </p>
          </div>
          <div>
            <p className="metric-label">Отклик</p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums">
              {Number(stats.response_rate_pct).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
