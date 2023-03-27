import { Fetcher, FetchResults } from '../../../mixins'
import { ServerTablePaging, ServerTableSort, ServerTableOptions, ServerTableFetcherConfig } from './table.type'

export interface ServerTableProviderConfig <D extends Record<string, any>> {
  uid?: string
  fetcher: Fetcher<ServerTableFetcherConfig<D>, FetchResults<D>>
  defaultSearch?: string
  defaultPaging?: ServerTablePaging
  defaultSort?: ServerTableSort<D>
  defaultData?: D[]
  options?: Array<ServerTableOptions<D>>
}
