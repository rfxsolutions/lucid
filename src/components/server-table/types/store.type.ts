import { LucidServerTablePaginatorState } from './paginator.type'
import { LucidServerTableSearchState } from './search.type'
import { LucidServerTableState } from './table.type'

export interface ServerTableStoreConfig <D extends Record<string, any>> {
  uid: string
  updateState: (state: Partial<LucidServerTableState<D>>) => void
}

export interface ServerTableSearchStoreConfig {
  uid: string
  updateState: (state: Partial<LucidServerTableSearchState>) => void
}

export interface ServerTablePaginatorStoreConfig {
  uid: string
  updateState: (state: Partial<LucidServerTablePaginatorState>) => void
}
