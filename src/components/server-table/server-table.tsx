import { Component, h, JSX, Prop, State, Element } from '@stencil/core'
import { ServerTableStore } from './stores'
import { LucidServerTableState, ServerTableOptions } from './types'
import { get } from 'lodash'
import $ from 'jquery'

const breakPoints = {
  xs: 'xs:table-cell',
  sm: 'sm:table-cell',
  md: 'md:table-cell',
  lg: 'lg:table-cell',
  xl: 'xl:table-cell',
  '2xl': '2xl:table-cell'
}

const textAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

const widths = {
  'sm:1': 'sm:w-1/12',
  'sm:2': 'sm:w-2/12',
  'sm:3': 'sm:w-3/12',
  'sm:4': 'sm:w-4/12',
  'sm:5': 'sm:w-5/12',
  'sm:6': 'sm:w-6/12',
  'sm:7': 'sm:w-7/12',
  'sm:8': 'sm:w-8/12',
  'sm:9': 'sm:w-9/12',
  'sm:10': 'sm:w-10/12',
  'sm:11': 'sm:w-11/12',
  'sm:12': 'sm:w-12/12',
  'md:1': 'md:w-1/12',
  'md:2': 'md:w-2/12',
  'md:3': 'md:w-3/12',
  'md:4': 'md:w-4/12',
  'md:5': 'md:w-5/12',
  'md:6': 'md:w-6/12',
  'md:7': 'md:w-7/12',
  'md:8': 'md:w-8/12',
  'md:9': 'md:w-9/12',
  'md:10': 'md:w-10/12',
  'md:11': 'md:w-11/12',
  'md:12': 'md:w-12/12',
  'lg:1': 'lg:w-1/12',
  'lg:2': 'lg:w-2/12',
  'lg:3': 'lg:w-3/12',
  'lg:4': 'lg:w-4/12',
  'lg:5': 'lg:w-5/12',
  'lg:6': 'lg:w-6/12',
  'lg:7': 'lg:w-7/12',
  'lg:8': 'lg:w-8/12',
  'lg:9': 'lg:w-9/12',
  'lg:10': 'lg:w-10/12',
  'lg:11': 'lg:w-11/12',
  'lg:12': 'lg:w-12/12'
}
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

  componentWillRender (): void {
  }

  generateTableHeader (option: ServerTableOptions<D>, i: number): JSX.Element | null {
    const text = option.text != null ? `${textAlign[option.text]}` : 'text-center'
    const hidden = option.breakpoint != null ? `hidden ${breakPoints[option.breakpoint]}` : ''
    const width = option.width?.reduce((accumulator, option) => {
      accumulator += ` ${String(widths[`${option.breakpoint}:${option.size}`])}`
      return accumulator
    }, '')
    const classes = `${String(hidden)} py-4 ${text} text-sm font-bold text-slate-700 ${width}`.trim()

    switch (option.custom) {
      case 'templates':
      case 'template-header': {
        const template = this.host.querySelector<HTMLTemplateElement>(`template[name="${String(option.id)}.header"]`)

        const content = template?.content
        if (content != null) {
          const serializer = new XMLSerializer()
          const html = serializer.serializeToString(content)
          return <th key={i} innerHTML={html} class={classes} />
        } else {
          return <th key={i} scope='col' class={classes.replace('text-slate-700', 'text-red-500')}>ERROR</th>
        }
      }
      default: {
        return <th key={i} scope='col' class={classes}>{option.label}</th>
      }
    }
  }

  generateTableDataCell (option: ServerTableOptions<D>, element: D, i: number): JSX.Element | null {
    const text = option.text != null ? `${textAlign[option.text]}` : 'text-center content-center'
    const hidden = option.breakpoint != null ? `hidden ${breakPoints[option.breakpoint]}` : ''
    const classes = `${hidden} py-4 text-sm ${text} text-slate-500 text-ellipsis overflow-hidden whitespace-nowrap`.trim()
    switch (option.custom) {
      case 'templates':
      case 'template-data': {
        const template = this.host.querySelector<HTMLTemplateElement>(`template[name="${String(option.id)}.data"]`)
        if (template == null) {
          console.error(`custom DATA template expected for table ${this.providerId}, option: ${JSON.stringify(option)}.`)
          return <td key={i} class='px-3 py-4 text-sm text-left text-red-500 text-ellipsis overflow-hidden'>ERROR</td>
        }
        const content = template?.content
        if (content != null) {
          const mapperString = template.dataset.mapper
          const mappings = mapperString.split(',')

          for (const mapping of mappings) {
            const [tagName, attributeName, dataKey] = mapping.split(':')

            if (attributeName != null && tagName != null && dataKey != null) {
              const el = content.querySelector(tagName)
              el?.setAttribute(attributeName, element[dataKey])
            }
          }

          const serializer = new XMLSerializer()
          const html = serializer.serializeToString(content)
          return <td key={i} class={classes} innerHTML={html} />
        }
        break
      }
      default: {
        return <td key={i} class={classes}>{get(element, option.key)}</td>
      }
    }
  }

  render (): JSX.Element {
    return (
      <div class='relative overflow-hidden shadow sm:rounded-lg shadow-lg bg-white'>

        {/* Table */}
        <table class='min-w-full table-auto table-fixed'>
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
