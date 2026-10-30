import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: keyof T
  header: string
  render?: (row: T) => ReactNode
}

export interface TableProps<T extends { id: string | number }> {
  caption: string
  columns: TableColumn<T>[]
  data: T[]
  emptyMessage: string
}

function Table<T extends { id: string | number }>({
  caption,
  columns,
  data,
  emptyMessage,
}: TableProps<T>) {
  return (
    <div className="table-scroll">
      <table className="user-table">
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => <th key={String(column.key)} scope="col">{column.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                const cell = column.render
                  ? column.render(row)
                  : String(row[column.key] ?? '')
                return <td key={String(column.key)}>{cell}</td>
              })}
            </tr>
          )) : (
            <tr>
              <td className="empty-cell" colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
