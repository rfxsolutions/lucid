import { LucidServerTableState } from './table.type'

export interface ServerTableStoreConfig <D extends Record<string, any>> {
  uid: string
  updateState: (state: Partial<LucidServerTableState<D>>) => void
}
