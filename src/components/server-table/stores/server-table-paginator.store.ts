import { uniqueId } from 'lodash'
import { ServerTablePaging, ServerTableStoreConfig } from '../types'
import { mixin } from '../../../mixins/ts.mixin'
import { PostalMixin } from '../../../mixins/postal.mixin'
import { LoggerMixin } from '../../../mixins/logger.mixin'
import { ServerTableTopicsMixin } from '../mixins/server-table-topics.mixin'
import postal from 'postal'

export class ServerTablePaginatorStore<D> extends mixin(
  PostalMixin,
  LoggerMixin,
  ServerTableTopicsMixin
) {
  // State
  public paging: ServerTablePaging = { skip: 0, limit: 10 }
  public count: number = 0

  constructor (config: ServerTableStoreConfig<D>) {
    super()
    this.channel = postal.channel('server-table')
    this.topicId = config.uid ?? uniqueId('topic')

    this.setup()
  }

  // Lifecycle Hooks
  private setup (): void {
    this.subscriptions.push(
      this.channel.subscribe(this.topics.terminateSubscriptions, this.destroy),
      this.channel.subscribe(this.topics.updatePaging, this.updatePaging),
      this.channel.subscribe(this.topics.updateCount, this.updateCount)
    )
  }

  public load (): void {
    this.channel.publish(this.topics.emitPaging)
    this.channel.publish(this.topics.emitCount)
  }

  // Effect Handlers
  private updatePaging (data: ServerTablePaging): void {
    this.paging = data
  }

  private updateCount (data: number): void {
    this.count = data
  }

  // Event Emitters
  public performPaging (data: ServerTablePaging): void {
    this.channel.publish(this.topics.performPaging, data)
  }
}
