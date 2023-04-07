import { Component, h, JSX, Prop, State, Element } from '@stencil/core'
import { ServerTableStore } from './stores'
import { LucidServerTableState, ServerTableOptions } from './types'
import { get } from 'lodash'

@Component({
  tag: 'lucid-server-table',
  styleUrl: '../../css/tailwind.css',
  shadow: true
})

export class LucidServerTable<D extends Record<string, any>> {
  @Prop() providerId: string
  @State() state: LucidServerTableState<D> = { data: [], options: [], sort: {}, fetchState: 'idle' }
  @Element() host: HTMLDivElement

  store: ServerTableStore<D>

  connectedCallback (): void {
    const updateState = (state: Partial<LucidServerTableState<D>>): void => {
      this.state = {
        ...this.state,
        ...state
      }
    }
    this.store = new ServerTableStore({ uid: this.providerId, updateState })
    this.store.load()
  }

  componentWillLoad (): void {
  }

  generateTableHeader (option: ServerTableOptions<D>, i: number): JSX.Element | null {
    switch (option.custom) {
      case 'templates':
      case 'template-header': {
        const template = this.host.querySelector<HTMLTemplateElement>(`template[name="${String(option.id)}.header"]`)

        const content = template?.content
        if (content != null) {
          const serializer = new XMLSerializer()
          const html = serializer.serializeToString(content)
          return <th key={i} innerHTML={html} class='px-3 py-4 text-left text-sm font-bold text-slate-700' />
        } else {
          return <th key={i} scope='col' class='px-3 py-4 text-left text-sm font-bold text-red-500'>ERROR</th>
        }
      }
      default: {
        return <th key={i} scope='col' class='px-3 py-4 text-left text-sm font-bold text-slate-700'>{option.label}</th>
      }
    }
  }

  generateTableDataCell (option: ServerTableOptions<D>, element: D, i: number): JSX.Element | null {
    switch (option.custom) {
      case 'templates':
      case 'template-data': {
        const template = this.host.querySelector<HTMLTemplateElement>(`template[name="${String(option.id)}.data"]`)
        if (template == null) {
          console.error(`custom DATA template expected for table ${this.providerId}, option: ${JSON.stringify(option)}.`)
          return <td key={i} class='px-3 py-4 text-sm text-left text-red-500 text-ellipsis overflow-hidden'>ERROR</td>
        }
        const mapperString = template.dataset.mapper
        const [tagName, attributeName, dataKey] = mapperString.split(':')

        const content = template?.content
        if (content != null) {
          if (attributeName != null && tagName != null && dataKey != null) {
            const el = content.querySelector(tagName)
            el?.setAttribute(attributeName, element[dataKey])
          }
          const serializer = new XMLSerializer()
          const html = serializer.serializeToString(content)
          return <td key={i} class='px-3 py-4 text-sm text-left text-slate-500 text-ellipsis overflow-hidden' innerHTML={html} />
        }
        break
      }
      default: {
        return <td key={i} class='px-3 py-4 text-sm text-left text-slate-500 text-ellipsis overflow-hidden'>{get(element, option.key)}</td>
      }
    }
  }

  render (): JSX.Element {
    return (
      <div class='relative overflow-hidden shadow sm:rounded-lg shadow-lg px-4 bg-white'>

        {/* Table */}
        <table class='table-auto w-full table-fixed'>
          <thead>
            <tr>
              {this.state.options.map((option, i) => this.generateTableHeader(option, i))}
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((element) => (
              <tr key={element.__id} class='odd:bg-slate-50 even:bg-white'>
                {this.state.options.map((option, i) => this.generateTableDataCell(option, element, i))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginator */}
        <slot name='paginator' />

        {/* Loading Indicator */}
        {
          this.state.fetchState === 'loading' && (
            <div class='absolute top-0 left-0 w-full h-full bg-white/[.5] rounded-md dark:bg-gray-800/[.4]' />

          )
        }
        {
          this.state.fetchState === 'loading' && (
            <div class='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <div class='animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full' role='status' aria-label='loading'>
                <span class='sr-only'>Loading...</span>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
