/**
 * Честное пустое состояние. Используется вместо демо-данных там, где
 * в базе реально нет строк (или где нужного поля нет в схеме вообще).
 */
export default function Empty({ children }: { children?: React.ReactNode }) {
  return <p className="empty">{children ?? 'Данных пока нет'}</p>
}
