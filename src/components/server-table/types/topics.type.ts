
export interface ServerTableProviderTopics {
  emitSearch: 'search.emit'
  emitTableOptions: 'table-options.emit'
  emitData: 'data.emit'
  emitPaging: 'paging.emit'
  emitCount: 'count.emit'
  emitSort: 'sort.emit'

  updateSearch: 'search.update'
  updateFetchState: 'fetch-state.update'
  updateTableOptions: 'table-options.update'
  updateData: 'data.update'
  updatePaging: 'paging.update'
  updateCount: 'count.update'
  updateSort: 'sort.update'

  performSearch: 'search.perform'
  performSort: 'sort.perform'
  performPaging: 'page.perform'

  terminateSubscriptions: 'terminate-subs'
}

export type ServerTableProviderTopicsWithIds<TOPIC_ID extends string = string> = {
  [P in keyof ServerTableProviderTopics]: `${TOPIC_ID}.${ServerTableProviderTopics[P]}`
}