import { uniqueId } from 'lodash'
import { LucidServerTableState, ServerTableOptions, ServerTableSort, ServerTableStoreConfig } from '../types'
import { FetchState, LoggerMixin, mixin, PostalMixin } from '../../../mixins'
import { ServerTableTopicsMixin } from '../mixins'
import postal from 'postal'

export class ServerTableStore<D> extends mixin(
  PostalMixin,
  LoggerMixin,
  ServerTableTopicsMixin
) {
  // State
  public options: Array<ServerTableOptions<D>> = []
  public data: D[] = []
  public sort: ServerTableSort<D> | null = null
  public fetchState: FetchState
  private readonly updateState: (state: Partial<LucidServerTableState<D>>) => void

  constructor (config: ServerTableStoreConfig<D>) {
    super()
    this.channel = postal.channel('server-table')
    this.providerId = config.uid ?? uniqueId('topic')
    this.updateState = config.updateState

    this.setup()
  }

  public setState (state: Partial<LucidServerTableState<D>>): void {
    this.updateState(state)
    for (const prop in state) {
      this[prop] = state[prop]
    }
  }

  // Lifecycle Hooks
  private setup (): void {
    this.subscriptions.push(
      this.channel.subscribe(this.topics.terminateSubscriptions, () => this.destroy()),
      this.channel.subscribe(this.topics.updateData, (data: D[]) => this.setState({ data })),
      this.channel.subscribe(this.topics.updateFetchState, (data: FetchState) => this.setState({ fetchState: data })),
      this.channel.subscribe(this.topics.updateSort, (sort: ServerTableSort<D>) => this.setState({ sort })),
      this.channel.subscribe(this.topics.updateTableOptions, (options: Array<ServerTableOptions<D>>) => this.setState({ options }))
    )
  }

  public load (): void {
    this.channel.publish(this.topics.emitTableOptions)
    this.channel.publish(this.topics.emitData)
    this.channel.publish(this.topics.emitSort)
  }

  // Event Emitters
  public performSort (data: ServerTableSort<D> | null): void {
    this.channel.publish(this.topics.updateSort, data)
  }
}
