
import { Constructor } from '../../../mixins/ts.mixin'
import { ServerTableProviderTopicsWithIds } from '../types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ServerTableTopicsMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    public providerId: string

    public get topics (): ServerTableProviderTopicsWithIds {
      return {
        emitSearch: `${this.providerId}.search.emit`,
        emitTableOptions: `${this.providerId}.table-options.emit`,
        emitData: `${this.providerId}.data.emit`,
        emitPaging: `${this.providerId}.paging.emit`,
        emitCount: `${this.providerId}.count.emit`,
        emitSort: `${this.providerId}.sort.emit`,

        updateFetchState: `${this.providerId}.fetch-state.update`,
        updateSearch: `${this.providerId}.search.update`,
        updateSort: `${this.providerId}.sort.update`,
        updateTableOptions: `${this.providerId}.table-options.update`,
        updateData: `${this.providerId}.data.update`,
        updatePaging: `${this.providerId}.paging.update`,
        updateCount: `${this.providerId}.count.update`,

        performSearch: `${this.providerId}.search.perform`,
        performSort: `${this.providerId}.sort.perform`,
        performPaging: `${this.providerId}.page.perform`,

        terminateSubscriptions: `${this.providerId}.terminate-subs`
      }
    }
  }

  return Mixin
}
