import { ServerPaging } from '.'
import { FetchState } from '../../../mixins'

export type ServerTableSort<D> = Partial<Record<keyof D, number>>

export interface ServerTableFilter extends ServerPaging {
  search?: string
}

export interface ServerTableOptionsBase<D> {
  reducer?: (element: D) => string
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  text?: 'left' | 'center' | 'right'
  width?: Array<{
    breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  }>
}

export interface ServerTableOptionsSimple <D extends Record<string, any>> extends ServerTableOptionsBase<D> {
  custom?: never
  id?: never
  label: string
  key: keyof D
}

export interface ServerTableOptionsCustomData <D extends Record<string, any>> extends ServerTableOptionsBase<D> {
  custom: 'template-data'
  id: string
  label: string
}

export interface ServerTableOptionsCustomHeader <D extends Record<string, any>> extends ServerTableOptionsBase<D> {
  custom: 'template-header'
  id: string
  key: keyof D
}

export interface ServerTableOptionsCustom <D extends Record<string, any>> extends ServerTableOptionsBase<D> {
  custom: 'templates'
  id: string
}

export type ServerTableOptions <D extends Record<string, any>> = ServerTableOptionsSimple<D> | ServerTableOptionsCustom<D> | ServerTableOptionsCustomData<D> | ServerTableOptionsCustomHeader<D>

export interface ServerTableFetcherConfig <D extends Record<string, any>> {
  sort?: ServerTableSort<D>
  filter?: ServerTableFilter
}

export interface LucidServerTableState<D> {
  data: D[]
  options: Array<ServerTableOptions<D>>
  sort: ServerTableSort<D>
  fetchState: FetchState
}
