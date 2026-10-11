'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header'
import CampaignStats from '@/components/CampaignStats'
import ContactQueue from '@/components/ContactQueue'
import ManualSend from '@/components/ManualSend'
import EngagementChart from '@/components/EngagementChart'
import { apiGet } from '@/lib/api'
import { EMPTY_STATS, type StatsPayload } from '@/lib/types'

/**
 * Все данные идут через серверные роуты /api/*: у таблиц включён RLS без
 * anon-политик, поэтому браузерный Supabase-клиент не используется вообще.
 * Realtime-подписка по той же причине невозможна — обновление по кнопке/пересчёту.
 */

const TABS = [
  { id: 'overview', label: 'Обзор' },
  { id: 'queue', label: 'Очередь' },
  { id: 'send', label: 'Касание' },
  { id: 'analytics', label: 'Аналитика' },
] as const

type TabId = (typeof TABS)[number]['id']

const EMPTY_PAYLOAD: StatsPayload = {
  stats: EMPTY_STATS,
  leadsByStatus: [],
  leadsTotal: 0,
}

export default function Dashboard() {
  const [tab, setTab] = useState<TabId>('overview')
  const [payload, setPayload] = useState<StatsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(() => {
    apiGet<StatsPayload>('/api/stats')
      .then((data) => {
        setPayload(data)
        setError(null)
      })
      .catch((err: Error) => {
        setPayload(EMPTY_PAYLOAD)
        setError(err.message)
      })
  }, [])

  useEffect(loadStats, [loadStats])

  return (
    <div className="min-h-screen">
      <Header stats={(payload ?? EMPTY_PAYLOAD).stats} />

      <nav className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-sm transition ${
                tab === t.id
                  ? 'font-semibold text-neutral-900 shadow-[inset_0_-2px_0_0_#00AEEF]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 pb-16">
        {error !== null && (
          <p className="pt-6 text-sm text-red-500">
            Не удалось прочитать базу: {error}
          </p>
        )}

        {payload === null ? (
          <p className="empty">Загрузка…</p>
        ) : (
          <>
            {tab === 'overview' && <CampaignStats payload={payload} />}
            {tab === 'queue' && <ContactQueue />}
            {tab === 'send' && <ManualSend onSaved={loadStats} />}
            {tab === 'analytics' && <EngagementChart />}
          </>
        )}
      </main>
    </div>
  )
}
