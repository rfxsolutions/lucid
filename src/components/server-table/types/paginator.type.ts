export interface ServerPaging {
  skip: number
  limit: number
}

export interface LucidServerTablePaginatorState {
  count: number
  paging: ServerPaging
}
