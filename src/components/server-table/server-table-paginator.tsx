import { Component, h, JSX, Prop, State, Watch } from '@stencil/core'
import { ServerTablePaginatorStore } from './stores'
import { LucidServerTablePaginatorState } from './types'

@Component({
  tag: 'lucid-server-paginator',
  styleUrl: '../../css/tailwind.css',
  shadow: true,
  assetsDirs: [
    'data-providers/server-table.data-provider'
  ]
})

export class LucidServerPaginator {
  @Prop() providerId: string

  @State() state: LucidServerTablePaginatorState = { paging: { skip: 0, limit: 10 }, count: 0 }
  @State() disabledPrevious: boolean = true
  @State() disabledNext: boolean = true

  @Watch('state') watchState (newState): void {
    this.updateDisabledState(newState)
  }

  public store: ServerTablePaginatorStore

  connectedCallback (): void {
    const updateState = (state: Partial<LucidServerTablePaginatorState>): void => {
      const updatedState = {
        ...this.state,
        ...state
      }
      this.state = updatedState
    }
    this.store = new ServerTablePaginatorStore({ uid: this.providerId, updateState })
  }

  componentWillLoad (): void {
    this.store.load()
  }

  updateDisabledState (state: LucidServerTablePaginatorState): void {
    const count = state.count
    const paging = state.paging

    this.disabledPrevious = paging.skip === 0
    this.disabledNext = count === 0 ? false : paging.skip + paging.limit >= count
  }

  render (): JSX.Element {
    return (
      <nav class='flex items-center justify-between bg-white px-4 py-3 sm:px-6' aria-label='Pagination'>
        <div class='hidden sm:block'>
          <p class='text-sm text-slate-700'> Showing <span class='font-medium'>{this.state.paging.skip + 1}</span> to <span class='font-medium'>{this.state.paging.skip + this.state.paging.limit}</span> of <span class='font-medium'>{this.state.count}</span> results </p>
        </div>
        <div class='flex flex-1 justify-between sm:justify-end gap-3'>

          {/* <lucid-button preset='secondary' disabled={this.disabledPrevious} onClick={() => this.store.performPaging({ skip: Math.max(this.state.paging.skip - this.state.paging.limit, 0), limit: this.state.paging.limit })} label='Previous' />
          <lucid-button preset='secondary' disabled={this.disabledNext} onClick={() => this.store.performPaging({ skip: this.state.paging.skip + this.state.paging.limit, limit: this.state.paging.limit })} label='Next' /> */}
          {/* TODO: replace with lucid button once it is done */}
          <a
            class='relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 cursor-pointer'
            onClick={() => !this.disabledPrevious && this.store.performPaging({ skip: Math.max(this.state.paging.skip - this.state.paging.limit, 0), limit: this.state.paging.limit })}
          >
            Previous
          </a>
          <a
            class='relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-offset-0 cursor-pointer'
            onClick={() => !this.disabledNext && this.store.performPaging({ skip: this.state.paging.skip + this.state.paging.limit, limit: this.state.paging.limit })}
          >
            Next
          </a>
        </div>
      </nav>
    )
  }
}
