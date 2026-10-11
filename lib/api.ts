/**
 * Клиентский помощник. Компоненты ходят только сюда — напрямую в Supabase
 * из браузера ходить нельзя: anon-политик у таблиц нет.
 */

import type { ApiResult } from './result'

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' })
  const body = (await res.json()) as ApiResult<T>
  if (!body.ok) throw new Error(body.error)
  return body.data
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = (await res.json()) as ApiResult<T>
  if (!body.ok) throw new Error(body.error)
  return body.data
}
