import { Component, Element, h, JSX, Listen, Prop, State, Watch } from '@stencil/core'
import { ServerTableSearchStore } from './stores'
import { LucidServerTableSearchState } from './types/search.type'

@Component({
  tag: 'lucid-server-search',
  styleUrl: '../../css/tailwind.css',
  shadow: true,
  assetsDirs: [
    'data-providers/server-table.data-provider'
  ]
})

export class LucidServerSearch {
  searchDebounceTimer: NodeJS.Timeout | null = null
  store: ServerTableSearchStore

  @Prop() providerId: string
  @Prop() label: string
  @Prop() autofocus: boolean = false
  @Prop() showHotkey: boolean = false

  @State() inputFocused: boolean = false
  @State() value: string = ''
  @State() state: LucidServerTableSearchState = { search: '' }

  @Element() host: HTMLElement

  connectedCallback (): void {
    const updateState = (state: Partial<LucidServerTableSearchState>): void => {
      const updatedState = {
        ...this.state,
        ...state
      }
      this.state = updatedState
    }

    this.store = new ServerTableSearchStore({ uid: this.providerId, updateState })
  }

  disconnectedCallback(): void {
    if (this.searchDebounceTimer != null) {
      clearTimeout(this.searchDebounceTimer)
    }
  }

  componentWillLoad (): void {
    this.store.load()
  }

  @Listen('keydown', { target: 'document' }) handleSearchHotkey (event: KeyboardEvent): void {
    if (event.key === 'k' && (this.isMac ? event.metaKey : event.ctrlKey)) {
      event.preventDefault()
      this.focusInput()
    }
  }

  @Listen('keydown') handleEscapeKey (event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.inputFocused) {
      if (this.value === '') {
        const input = this.host.shadowRoot.querySelector<HTMLInputElement>('#search')
        input.blur()
      }
      this.value = ''
    }
  }

  @Listen('keydown') handleEnterKey (event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.inputFocused) {
      this.clearTimeout()
      this.store.performSearch(this.value)
    }
  }

  @Watch('value') watchValue (): void {
    this.clearTimeout()
    this.searchDebounceTimer = setTimeout(() => {
      this.store.performSearch(this.value)
    }, 450)
  }

  get isMac (): boolean {
    return navigator.userAgent.includes('Mac')
  }

  get quickSearchLabel (): string {
    return this.isMac ? '⌘K' : 'Ctl+K'
  }

  setFocus(focused: boolean): void {
    this.inputFocused = focused
  }

  clearTimeout (): void {
    if (this.searchDebounceTimer != null) {
      clearTimeout(this.searchDebounceTimer)
    }
  }

  focusInput(): void {
    const input = this.host.shadowRoot.querySelector<HTMLInputElement>('#search')
    input.focus()
  }

  render (): JSX.Element {
    return (
      <div>
        {/* {this.label != null && <label htmlFor='search' class='block text-sm font-medium leading-6 text-slate-700'>{this.label}</label>} */}
        <div class='relative mt-2 flex items-center mt-6'>
          <input
            type='text'
            name='search'
            id='search'
            value={this.value}
            class={{
              'peer w-full rounded-md border-0 py-1.5 p-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-primary placeholder:text-slate-400 sm:text-sm sm:leading-6': true,
              'pr-12': !this.isMac && !this.inputFocused && this.value.length === 0,
              'pr-9': this.isMac && !this.inputFocused && this.value.length === 0,
              'pr-6': this.value.length > 0
            }}
            autofocus={this.autofocus}
            placeholder=' '
            onFocus={() => this.setFocus(true)}
            onBlur={() => this.setFocus(false)}
            onInput={(e) => { this.value = (e.target as any).value }}
          />
          {/* floating placeholder https://play.tailwindcss.com/cwqORB8ee7 / https://www.youtube.com/watch?v=nJzKi6oIvBA */}
          <label
            htmlFor='search'
            class='
              absolute
              left-0
              -top-5
              text-primary
              text-xs
              transition-all
              font-bold
              peer-placeholder-shown:font-normal
              peer-placeholder-shown:text-base
              peer-placeholder-shown:text-slate-400
              peer-placeholder-shown:top-1
              peer-placeholder-shown:left-3
              peer-focus:font-bold
              peer-focus:-top-5
              peer-focus:left-0
              peer-focus:text-primary
              peer-focus:text-xs
            '
            onFocus={() => this.focusInput()}
          >
            {this.label}
          </label>
          {this.showHotkey && !this.inputFocused && this.value.length === 0 && (
            <div class='absolute inset-y-0 right-0 flex py-1.5 pr-1.5 fade-in'>
              <kbd class='inline-flex items-center rounded border border-slate-200 px-1 font-sans text-xs text-slate-400'>{this.quickSearchLabel}</kbd>
            </div>
          )}
          {
            this.value.length > 0 && (
              <svg
                class='w-4 h-4 absolute right-2 flex text-slate-400 fill-primary animate-pulse cursor-pointer'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 384 512'
                onClick={() => { this.value = '' }}
              >
                <path d='M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z' />
              </svg>
            )
          }
        </div>
      </div>
    )
  }
}
