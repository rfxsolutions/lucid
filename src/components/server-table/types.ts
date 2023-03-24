export type ServerTableSort<D> = Record<keyof D, number>

export interface ServerTableFilter {
  skip: number
  limit: number
  search: string
}

export interface ServerTableTopics {
  setData: `${string}.set.data`
  setSort: `${string}.set.sort`
  setPaging: `${string}.set.paging`
  setSearch: `${string}.set.search`
}

export interface ServerTableOptions <D extends Record<string, any>> {
  label: string
  key: keyof D
  reducer?: (item: D) => string
}

export interface ServerTableFetcherConfig <D extends Record<string, any>> {
  sort: ServerTableSort<D>
  filter: ServerTableFilter
}

export interface ServerTableFetcherReturn <D extends Record<string, any>> {
  count: number
  results: D[]
}

export type ServerTableFetcher <D extends Record<string, any>> = (config: ServerTableFetcherConfig<D>) => Promise<ServerTableFetcherReturn<D>>

export interface ServerTableStoreConfig <D extends Record<string, any>> {
  options: Array<ServerTableOptions<D>>
  fetcher: ServerTableFetcher<D>
}
