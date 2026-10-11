/**
 * Серверный Supabase-клиент. ТОЛЬКО для app/api/ * /route.ts.
 *
 * У таблиц проекта hbnuxcdrdtzotlxaskwp включён RLS и НЕТ anon-политик
 * (миграции 001_series и sales_funnel_schema). Вью campaign_stats создано
 * с security_invoker=true, то есть под anon-ключом оно честно отдаёт нули.
 *
 * Поэтому читать данные можно только service-role ключом, и только с сервера.
 * Переменная SUPABASE_SERVICE_KEY намеренно без префикса NEXT_PUBLIC_ —
 * Next.js физически не вставит её в клиентский бандл.
 */

import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ApiResult } from './result'

let cached: SupabaseClient | null = null

export function getDb(): SupabaseClient {
  if (cached !== null) return cached

  const url = (process.env.SUPABASE_URL ?? '').trim()
  const key = (process.env.SUPABASE_SERVICE_KEY ?? '').trim()

  if (url.length === 0 || key.length === 0) {
    throw new Error(
      'SUPABASE_URL и SUPABASE_SERVICE_KEY обязательны. Задайте их в .env.local (локально) ' +
        'или в переменных окружения деплоя. Без них дашборд не может читать базу.',
    )
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return cached
}

export function fail(message: string, status = 500): Response {
  return Response.json({ ok: false, error: message } satisfies ApiResult<never>, { status })
}

export function ok<T>(data: T): Response {
  return Response.json({ ok: true, data } satisfies ApiResult<T>)
}
