
import { Constructor } from '../../../mixins/ts.mixin'
import { ServerTableProviderTopicsWithIds } from '../types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ServerTableTopicsMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    public topicId: string

    public get topics (): ServerTableProviderTopicsWithIds {
      return {
        emitSearch: `${this.topicId}.search.emit`,
        emitTableOptions: `${this.topicId}.table-options.emit`,
        emitData: `${this.topicId}.data.emit`,
        emitPaging: `${this.topicId}.paging.emit`,
        emitCount: `${this.topicId}.count.emit`,
        emitSort: `${this.topicId}.sort.emit`,

        updateSearch: `${this.topicId}.search.update`,
        updateSort: `${this.topicId}.sort.update`,
        updateTableOptions: `${this.topicId}.table-options.update`,
        updateData: `${this.topicId}.data.update`,
        updatePaging: `${this.topicId}.paging.update`,
        updateCount: `${this.topicId}.count.update`,

        performSearch: `${this.topicId}.search.perform`,
        performSort: `${this.topicId}.sort.perform`,
        performPaging: `${this.topicId}.page.perform`,

        terminateSubscriptions: `${this.topicId}.terminate-subs`
      }
    }
  }

  return Mixin
}
