import { uniqueId } from 'lodash';
import { ServerTableFetcher, ServerTableFilter, ServerTableOptions, ServerTableSort, ServerTableStoreConfig, ServerTableTopics } from './types';
import postal from 'postal'

export class ServerTableStore<D> {
  // State
  private readonly _logger: typeof console = console
  private readonly _channel: ReturnType<typeof postal.channel> = postal.channel('server-table')
  private readonly _subscriptions: Array<ReturnType<typeof postal.subscribe>> = []
  private readonly _fetchTasks: Array<Promise<unknown>> = []

  public readonly storeId: string
  public readonly fetcher: ServerTableFetcher<D>
  public readonly options: Array<ServerTableOptions<D>>
  public data: D[] = []
  public paging: Pick<ServerTableFilter, 'limit' | 'skip'> = { limit: 10, skip: 0 } // TODO: move these init values into store options
  public sort: ServerTableSort<D> | null = null
  public search: string = ''
  public fetchState: 'loading' | 'idle' | 'error' = 'idle'
  public count: number = 0

  constructor (config: ServerTableStoreConfig<D>) {
    this.storeId = uniqueId('st')
    this.fetcher = config.fetcher
    this.options = config.options
  }

  // Derived State
  private get _filter (): ServerTableFilter {
    return {
      skip: this.paging.skip,
      limit: this.paging.limit,
      search: this.search
    }
  }

  private get _topics (): ServerTableTopics {
    return {
      setData: `${this.storeId}.set.data`,
      setSort: `${this.storeId}.set.sort`,
      setPaging: `${this.storeId}.set.paging`,
      setSearch: `${this.storeId}.set.search`
    }
  }

  // Lifecycle Hooks
  public setup (): void {
    const setDataSub = this._channel.subscribe(this._topics.setData, this._setData)
    const updateSortSub = this._channel.subscribe(this._topics.setSort, (data: ServerTableSort<D>) => { void this._performSort(data) })
    const updatePagingSub = this._channel.subscribe(this._topics.setPaging, (data: Pick<ServerTableFilter, 'limit' | 'skip'>) => { void this._performPaging(data) })
    const updateSearchSub = this._channel.subscribe(this._topics.setSearch, (data: string) => { void this._performSearch(data) })

    this._subscriptions.push(
      setDataSub,
      updateSortSub,
      updatePagingSub,
      updateSearchSub
    )
  }

  public teardown (): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }

  // Effect Generators
  private _setData (data: D[]): void {
    this.data = data
  }

  private async performFetch (): Promise<void> {
    try {
      this.fetchState = 'loading'
      const fetch = this.fetcher({ sort: this.sort, filter: this._filter })
      this._fetchTasks.push(fetch)

      const resp = await fetch

      void this._fetchTasks.pop()
      if (this._fetchTasks.length === 0) {
        this.fetchState = 'idle'
      }

      this.data = resp.results
      this.count = resp.count
    } catch (e) {
      this.fetchState = 'error'
      this._logger.error(e)
    }
  }

  private async _performSort (sort: ServerTableSort<D> | null): Promise<void> {
    this.sort = sort
    await this.performFetch()
  }

  private async _performPaging (paging: Pick<ServerTableFilter, 'limit' | 'skip'>): Promise<void> {
    this.paging = paging
    await this.performFetch()
  }

  private async _performSearch (search: string): Promise<void> {
    this.search = search
    await this.performFetch()
  }

  public updateData (data: D[]): void {
    this._channel.publish(this._topics.setData, data)
  }

  public updateSort (data: ServerTableSort<D> | null): void {
    this._channel.publish(this._topics.setSort, data)
  }

  public updatePaging (data: Pick<ServerTableFilter, 'limit' | 'skip'>): void {
    this._channel.publish(this._topics.setPaging, data)
  }

  public updateSearch (data: string): void {
    this._channel.publish(this._topics.setSearch, data)
  }
}
