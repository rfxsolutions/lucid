import { uniqueId } from 'lodash'
import { ServerTableSearchStoreConfig } from '../types'
import { ServerTableTopicsMixin } from '../mixins'
import { PostalMixin, LoggerMixin, mixin } from '../../../mixins'
import postal from 'postal'
import { LucidServerTableSearchState } from '../types/search.type'

export class ServerTableSearchStore extends mixin(
  PostalMixin,
  LoggerMixin,
  ServerTableTopicsMixin
) {
  // State
  public search: string = ''
  private readonly updateState: (state: Partial<LucidServerTableSearchState>) => void

  constructor (config: ServerTableSearchStoreConfig) {
    super()
    this.channel = postal.channel('server-table')
    this.providerId = config.uid ?? uniqueId('topic')
    this.updateState = config.updateState

    this.setup()
  }

  public setState (state: Partial<LucidServerTableSearchState>): void {
    this.updateState(state)
    for (const prop in state) {
      this[prop] = state[prop]
    }
  }

  // Lifecycle Hooks
  private setup (): void {
    this.subscriptions.push(
      this.channel.subscribe(this.topics.terminateSubscriptions, this.destroy),
      this.channel.subscribe(this.topics.updateSearch, (data: string) => { this.setState({ search: data }) })
    )
  }

  public load (): void {
    this.channel.publish(this.topics.emitSearch)
  }

  // Event Emitters
  public performSearch (data: string): void {
    this.channel.publish(this.topics.performSearch, data)
  }
}
