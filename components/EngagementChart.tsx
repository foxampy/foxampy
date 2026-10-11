'use client'

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Empty from '@/components/Empty'
import { apiGet } from '@/lib/api'
import type { AnalyticsPayload, NameValue } from '@/lib/types'

/**
 * Аналитика. Всё из TABLE public.outreach_log и TABLE public.dm_leads.
 *
 * УДАЛЕНО вместе с демо-массивами (и не заменено ничем, потому что в схеме
 * нет соответствующих полей):
 *   engagementData  — «Открыли письмо» / «Кликнули»: в outreach_log нет
 *                     opened_at / clicked_at, трекинга открытий не существует.
 *                     Вместо него — реальное распределение по outcome.
 *   channelData     — серии opened / clicked / replied по каналам: см. выше.
 *                     Вместо них — реальное число касаний на канал.
 *   performanceData — «конверсия по дням недели»: конверсию нечем считать,
 *                     кроме outcome, а недельная разбивка по нему
 *                     на текущих объёмах данных ничего не измеряет.
 *   плитки 38% / CTR 15% / 9% / «Best time 9 AM» — выдуманные константы.
 *   блок «Рекомендации» — выдуманные выводы.
 */
export default function EngagementChart() {
  const [data, setData] = useState<AnalyticsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiGet<AnalyticsPayload>('/api/analytics')
      .then(setData)
      .catch((err: Error) => setError(err.message))
  }, [])

  if (error !== null) {
    return <p className="empty text-red-500">Не удалось загрузить аналитику: {error}</p>
  }
  if (data === null) {
    return <p className="empty">Загрузка…</p>
  }

  return (
    <div>
      <section className="section">
        <p className="section-label">Касания по дням, последние 14 дней</p>
        {data.timeline.length === 0 ? (
          <Empty>В таблице outreach_log пока нет ни одной отправки</Empty>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.timeline} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="#f2f2f2" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={{ stroke: '#ededed' }}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#8a8a8a' }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#8a8a8a' }}
              />
              <Tooltip
                contentStyle={{ border: 'none', boxShadow: 'none', fontSize: 12 }}
                formatter={(value: number) => [value, 'касаний']}
              />
              <Line
                type="monotone"
                dataKey="sent"
                stroke="#00AEEF"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      <Breakdown
        label="Касания по каналам"
        rows={data.byChannel}
        empty="outreach_log пуст — каналы считать не из чего"
      />

      <section className="section">
        <p className="section-label">Исходы касаний</p>
        {data.byOutcome.length === 0 ? (
          <Empty>outreach_log пуст</Empty>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={data.byOutcome}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            >
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={96}
                tick={{ fontSize: 11, fill: '#6a6a6a' }}
              />
              <Tooltip
                contentStyle={{ border: 'none', boxShadow: 'none', fontSize: 12 }}
                formatter={(value: number) => [value, 'касаний']}
              />
              <Bar dataKey="value" fill="#00AEEF" radius={0} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      <Breakdown
        label="Лиды бота по источнику"
        rows={data.leadsBySource}
        empty="dm_leads пуст — источники считать не из чего"
      />

      <section className="section">
        <p className="text-xs leading-relaxed text-neutral-400">
          Открытия и клики здесь не показаны: в схеме outreach_log нет полей
          opened_at / clicked_at, поэтому open-rate и CTR физически не из чего
          посчитать.
        </p>
      </section>
    </div>
  )
}

function Breakdown({
  label,
  rows,
  empty,
}: {
  label: string
  rows: NameValue[]
  empty: string
}) {
  return (
    <section className="section">
      <p className="section-label">{label}</p>
      {rows.length === 0 ? (
        <Empty>{empty}</Empty>
      ) : (
        <ul>
          {rows.map((row, i) => (
            <li
              key={row.name}
              className={`row flex items-baseline justify-between ${
                i === rows.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <span className="text-[15px] text-neutral-700">{row.name}</span>
              <span className="text-[15px] font-semibold tabular-nums">{row.value}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
