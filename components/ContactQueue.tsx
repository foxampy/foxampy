'use client'

import { useCallback, useEffect, useState } from 'react'
import { Linkedin, Mail, Send } from 'lucide-react'
import Empty from '@/components/Empty'
import { apiGet, apiPost } from '@/lib/api'
import type { Contact, DmLead } from '@/lib/types'

type QueueRow = Pick<
  Contact,
  | 'id'
  | 'full_name'
  | 'company'
  | 'position'
  | 'industry'
  | 'email'
  | 'telegram'
  | 'linkedin_url'
  | 'city'
  | 'source'
  | 'confidence_score'
>

type LeadRow = Omit<DmLead, 'telegram_id'>

/**
 * Очередь. Контакты берутся из public.contacts со status = 'new'
 * (значение 'queued' в схеме не используется — DEFAULT у колонки 'new'),
 * заявки — из public.dm_leads.
 */
export default function ContactQueue() {
  const [contacts, setContacts] = useState<QueueRow[] | null>(null)
  const [leads, setLeads] = useState<LeadRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const load = useCallback(() => {
    Promise.all([apiGet<QueueRow[]>('/api/queue'), apiGet<LeadRow[]>('/api/leads')])
      .then(([q, l]) => {
        setContacts(q)
        setLeads(l)
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  useEffect(load, [load])

  const markContacted = async (row: QueueRow) => {
    setBusy(row.id)
    try {
      await apiPost('/api/outreach', {
        contactId: row.id,
        channel: row.telegram !== null ? 'telegram' : row.email !== null ? 'email' : 'linkedin',
      })
      setContacts((prev) => (prev ?? []).filter((c) => c.id !== row.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось записать касание')
    } finally {
      setBusy(null)
    }
  }

  if (error !== null) {
    return <p className="empty text-red-500">{error}</p>
  }
  if (contacts === null || leads === null) {
    return <p className="empty">Загрузка…</p>
  }

  return (
    <div>
      <section className="section">
        <p className="section-label">Контакты без касания — {contacts.length}</p>
        {contacts.length === 0 ? (
          <Empty>В contacts нет строк со статусом new</Empty>
        ) : (
          <ul>
            {contacts.map((row, i) => (
              <li
                key={row.id}
                className={`row ${i === contacts.length - 1 ? 'border-b-0' : ''}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-neutral-900">
                      {row.full_name ?? 'Без имени'}
                    </p>
                    <p className="truncate text-sm text-neutral-500">
                      {[row.position, row.company].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-neutral-400">
                    {Math.round(Number(row.confidence_score) * 100)}%
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs">
                  {row.email !== null && (
                    <a
                      href={`mailto:${row.email}`}
                      className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-brand"
                    >
                      <Mail size={13} />
                      Email
                    </a>
                  )}
                  {row.linkedin_url !== null && (
                    <a
                      href={row.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-brand"
                    >
                      <Linkedin size={13} />
                      LinkedIn
                    </a>
                  )}
                  {row.telegram !== null && (
                    <span className="text-neutral-500">{row.telegram}</span>
                  )}
                  <button
                    onClick={() => void markContacted(row)}
                    disabled={busy === row.id}
                    className="ml-auto inline-flex items-center gap-1.5 font-semibold text-brand disabled:opacity-40"
                  >
                    <Send size={13} />
                    {busy === row.id ? 'Запись…' : 'Отметить касание'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="section">
        <p className="section-label">Заявки из бота — {leads.length}</p>
        {leads.length === 0 ? (
          <Empty>В dm_leads нет заявок</Empty>
        ) : (
          <ul>
            {leads.map((lead, i) => (
              <li key={lead.id} className={`row ${i === leads.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-[15px] font-medium text-neutral-900">
                    {lead.full_name}
                  </p>
                  <span className="shrink-0 text-xs text-neutral-400">{lead.status}</span>
                </div>
                {lead.company !== null && (
                  <p className="text-sm text-neutral-500">{lead.company}</p>
                )}
                <p className="mt-1 text-sm leading-snug text-neutral-600">{lead.request}</p>
                <p className="mt-1.5 text-xs text-neutral-400">
                  {new Date(lead.created_at).toLocaleString('ru-RU')} · {lead.source}
                  {lead.username !== null && ` · @${lead.username}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
