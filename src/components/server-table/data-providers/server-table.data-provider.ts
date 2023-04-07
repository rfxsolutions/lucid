import { uniqueId } from 'lodash'
import { ServerTableFetcherConfig, ServerTableOptions, ServerPaging, ServerTableSort } from '../types'
import { ServerTableTopicsMixin } from '../mixins/server-table-topics.mixin'
import { mixin, PostalMixin, LoggerMixin, FetcherMixin, FetchState } from '../../../mixins'
import postal from 'postal'
import { ServerTableProviderConfig } from '../types/provider.type'

export class ServerTableDataProvider<D> extends mixin(
  PostalMixin,
  LoggerMixin,
  FetcherMixin,
  ServerTableTopicsMixin
) {
  // State
  private search: string = ''
  private readonly options: Array<ServerTableOptions<D>> = []
  private paging: ServerPaging = { skip: 0, limit: 10 }
  private sort: ServerTableSort<D> = {}

  constructor (config: ServerTableProviderConfig<D>) {
    super()
    this.channel = postal.channel('server-table')
    this.providerId = config.uid ?? uniqueId('topic')

    this.options = config.options
    this.fetcher = config.fetcher
    this.search = config?.defaultSearch ?? this.search
    this.paging = config?.defaultPaging ?? this.paging
    this.sort = config?.defaultSort ?? this.sort
    this.data = config?.defaultData ?? this.data

    this.setup()
  }

  get fetcherConfig (): ServerTableFetcherConfig<D> {
    return {
      filter: {
        ...this.paging,
        search: this.search
      },
      sort: { ...this.sort }
    }
  }

  // Lifecycle Hooks
  private setup (): void {
    this.subscriptions.push(
      this.channel.subscribe(this.topics.emitSearch, () => this.updateSearch(this.search)),
      this.channel.subscribe(this.topics.emitTableOptions, () => this.updateTableOptions(this.options)),
      this.channel.subscribe(this.topics.emitData, () => this.updateData(this.data)),
      this.channel.subscribe(this.topics.emitPaging, () => this.updatePaging(this.paging)),
      this.channel.subscribe(this.topics.emitCount, () => this.updateCount(this.count)),
      this.channel.subscribe(this.topics.emitSort, () => this.updateSort(this.sort)),

      this.channel.subscribe(this.topics.performSearch, (data: string) => { void this.performSearch(data) }),
      this.channel.subscribe(this.topics.performPaging, (data: ServerPaging) => { void this.performPaging(data) }),
      this.channel.subscribe(this.topics.performSort, (data: ServerTableSort<D>) => { void this.performSort(data) })
    )

    this.updatePaging(this.paging)
    this.updateData(this.data)
    this.updateSearch(this.search)
    this.updateTableOptions(this.options)
    this.updateSort(this.sort)
  }

  public async load (): Promise<void> {
    await this.performSearch('')
  }

  public terminate (): void {
    this.channel.publish(this.topics.terminateSubscriptions)
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  // Event Handlers
  private async performSearch (search: string): Promise<void> {
    this.search = search
    await this.performFetch(this.fetcherConfig)
    this.updateData(this.data)
    this.updateCount(this.count)
    this.updatePaging({ skip: 0, limit: this.paging.limit })
  }

  private async performPaging (paging: ServerPaging): Promise<void> {
    this.paging = paging
    await this.performFetch(this.fetcherConfig)
    this.updatePaging(this.paging)
    this.updateData(this.data)
    this.updateCount(this.count)
  }

  private async performSort (sort: ServerTableSort<D>): Promise<void> {
    this.sort = sort
    await this.performFetch(this.fetcherConfig)
    this.updateData(this.data)
    this.updateCount(this.count)
  }

  // Event Emitters
  public updateFetchState (data: FetchState): void {
    this.channel.publish(this.topics.updateFetchState, data)
  }

  private updateTableOptions (data: Array<ServerTableOptions<D>>): void {
    this.channel.publish(this.topics.updateTableOptions, data)
  }

  private updateData (data: D[]): void {
    this.channel.publish(this.topics.updateData, data)
  }

  private updateSort (data: ServerTableSort<D> | null): void {
    this.channel.publish(this.topics.updateSort, data)
  }

  private updatePaging (data: Partial<ServerPaging>): void {
    this.channel.publish(this.topics.updatePaging, data)
  }

  private updateCount (data: number): void {
    this.channel.publish(this.topics.updateCount, data)
  }

  private updateSearch (data: string): void {
    this.channel.publish(this.topics.updateSearch, data)
  }
}
