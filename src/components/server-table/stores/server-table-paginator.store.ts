import { uniqueId } from 'lodash'
import { LucidServerTablePaginatorState, ServerPaging, ServerTablePaginatorStoreConfig } from '../types'
import { mixin } from '../../../mixins/ts.mixin'
import { PostalMixin } from '../../../mixins/postal.mixin'
import { LoggerMixin } from '../../../mixins/logger.mixin'
import { ServerTableTopicsMixin } from '../mixins/server-table-topics.mixin'
import postal from 'postal'

export class ServerTablePaginatorStore extends mixin(
  PostalMixin,
  LoggerMixin,
  ServerTableTopicsMixin
) {
  // State
  public paging: ServerPaging = { skip: 0, limit: 10 }
  public count: number = 0
  private readonly updateState: (state: Partial<LucidServerTablePaginatorState>) => void

  constructor (config: ServerTablePaginatorStoreConfig) {
    super()
    this.channel = postal.channel('server-table')
    this.providerId = config.uid ?? uniqueId('topic')
    this.updateState = config.updateState

    this.setup()
  }

  public setState (state: Partial<LucidServerTablePaginatorState>): void {
    this.updateState(state)
    for (const prop in state) {
      this[prop] = state[prop]
    }
  }

  // Lifecycle Hooks
  private setup (): void {
    this.subscriptions.push(
      this.channel.subscribe(this.topics.terminateSubscriptions, () => this.destroy() ),
      this.channel.subscribe(this.topics.updatePaging, (paging: ServerPaging) => this.setState({ paging })),
      this.channel.subscribe(this.topics.updateCount, (count: number) => this.setState({ count }))
    )
  }

  public load (): void {
    this.channel.publish(this.topics.emitPaging)
    this.channel.publish(this.topics.emitCount)
  }

  // Event Emitters
  public performPaging (data: ServerPaging): void {
    this.channel.publish(this.topics.performPaging, data)
  }
}
