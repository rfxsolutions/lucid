import { Fetcher, FetchResults } from '../../../mixins'
import { ServerPaging, ServerTableSort, ServerTableOptions, ServerTableFetcherConfig } from '.'

export interface ServerTableProviderConfig <D extends Record<string, any>> {
  uid?: string
  fetcher: Fetcher<ServerTableFetcherConfig<D>, FetchResults<D>>
  defaultSearch?: string
  defaultPaging?: ServerPaging
  defaultSort?: ServerTableSort<D>
  defaultData?: D[]
  options?: Array<ServerTableOptions<D>>
}
