import { uniqueId } from 'lodash'
import { ServerTableStoreConfig } from '../types'
import { ServerTableTopicsMixin } from '../mixins'
import { PostalMixin, LoggerMixin, mixin } from '../../../mixins'
import postal from 'postal'

export class ServerTableSearchStore<D> extends mixin(
  PostalMixin,
  LoggerMixin,
  ServerTableTopicsMixin
) {
  // State
  public search: string = ''

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
      this.channel.subscribe(this.topics.updateSearch, this.updateSearch),
    )
  }

  public load (): void {
    this.channel.publish(this.topics.emitSearch)
  }

  // Effect Handlers
  private updateSearch (data: string): void {
    this.search = data
  }

  // Event Emitters
  public performSort (data: string): void {
    this.channel.publish(this.topics.performSearch, data)
  }
}
