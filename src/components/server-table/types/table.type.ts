export type ServerTableSort<D> = Partial<Record<keyof D, number>>

export interface ServerTablePaging {
  skip: number
  limit: number
}

export interface ServerTableFilter extends ServerTablePaging {
  search?: string
}

export interface ServerTableOptions <D extends Record<string, any>> {
  label: string
  key: keyof D
  custom?: boolean
  customAttributeKey?: string
  customElementSelector?: string
}

export interface ServerTableFetcherConfig <D extends Record<string, any>> {
  sort?: ServerTableSort<D>
  filter?: ServerTableFilter
}

export interface LucidServerTableState<D> {
  data: D[]
  options: Array<ServerTableOptions<D>>
  sort: ServerTableSort<D>
}
