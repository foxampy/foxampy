'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { apiPost } from '@/lib/api'

/**
 * Регистрация ручного касания.
 *
 * Пишет через POST /api/outreach в реальные таблицы: public.contacts
 * (поиск по email или создание) и public.outreach_log. Таблицы
 * manual_outreach, на которую ссылалась прежняя версия, в базе не существует.
 */

const CHANNELS = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'email', label: 'Email' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'phone', label: 'Телефон' },
  { id: 'in_person', label: 'Личная встреча' },
]

const EMPTY_FORM = {
  fullName: '',
  company: '',
  email: '',
  telegram: '',
  channel: 'telegram',
  templateId: '',
  message: '',
}

export default function ManualSend({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setNote(null)
    try {
      await apiPost('/api/outreach', form)
      setForm(EMPTY_FORM)
      setNote({ kind: 'ok', text: 'Касание записано в outreach_log.' })
      onSaved()
    } catch (err) {
      setNote({
        kind: 'err',
        text: err instanceof Error ? err.message : 'Не удалось записать касание',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <section className="section">
        <p className="section-label">Записать касание</p>

        {note !== null && (
          <p
            className={`mb-5 text-sm ${
              note.kind === 'ok' ? 'text-brand' : 'text-red-500'
            }`}
          >
            {note.text}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="field-label" htmlFor="fullName">
              Имя
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={change}
              required
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="company">
              Компания
            </label>
            <input
              id="company"
              name="company"
              value={form.company}
              onChange={change}
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={change}
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="telegram">
              Telegram
            </label>
            <input
              id="telegram"
              name="telegram"
              value={form.telegram}
              onChange={change}
              placeholder="@username"
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="channel">
              Канал
            </label>
            <select
              id="channel"
              name="channel"
              value={form.channel}
              onChange={change}
              className="field"
            >
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="templateId">
              ID шаблона
            </label>
            <input
              id="templateId"
              name="templateId"
              value={form.templateId}
              onChange={change}
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="message">
              Текст сообщения
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={change}
              rows={4}
              className="field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Send size={15} />
            {busy ? 'Запись…' : 'Записать'}
          </button>
        </form>
      </section>

      <section className="section">
        <p className="text-xs leading-relaxed text-neutral-400">
          Форма ничего никуда не отправляет. Сообщение вы отправляете сами, а эта
          запись нужна только для учёта: строка в outreach_log и перевод контакта
          в статус contacted.
        </p>
      </section>
    </div>
  )
}
