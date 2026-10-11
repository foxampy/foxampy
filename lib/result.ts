/** Единый конверт ответа всех API-роутов. Импортируется и клиентом, и сервером. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string }
