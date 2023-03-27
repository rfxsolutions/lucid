import { Component, h, JSX, Prop, State, Element } from '@stencil/core'
import { ServerTableStore } from './stores'
import { LucidServerTableState, ServerTableOptions } from './types'
import { get } from 'lodash'

@Component({
  tag: 'lucid-server-table',
  styleUrl: '../../css/tailwind.css',
  shadow: true,
  assetsDirs: [
    'data-providers/server-table.data-provider'
  ]
})

export class LucidServerTable<D extends Record<string, any> & { __id: string }> {
  @Prop() topicId: string
  @State() state: LucidServerTableState<D> = { data: [], options: [], sort: {} }
  @Element() host: HTMLDivElement

  store: ServerTableStore<D>

  connectedCallback (): void {
    const updateState = (state: Partial<LucidServerTableState<D>>): void => {
      this.state = {
        ...this.state,
        ...state
      }
    }
    this.store = new ServerTableStore({ uid: this.topicId, updateState })
  }

  generateCell (option: ServerTableOptions<D>, element: D, i: number): JSX.Element | null {
    if (option.custom !== true) {
      return <td key={i}>{get(element, option.key)}</td>
    }

    const template = this.host.querySelector<HTMLTemplateElement>('template')
    const content = template?.content
    if (content != null) {
      if (option.customAttributeKey != null && option.customElementSelector != null) {
        const el = content.querySelector(option.customElementSelector)
        el?.setAttribute(option.customAttributeKey, element[option.key])
      }
      const serializer = new XMLSerializer()
      const html = serializer.serializeToString(content)
      return <td key={i} innerHTML={html} />
    }
  }

  componentWillLoad (): void {
    this.store.load()
  }

  render (): JSX.Element {
    console.log(this.state)
    return (
      <table>
        <tr>
          {this.state.options.map((option, i) => (<th key={i}>{option.label}</th>))}
        </tr>
        {this.state.data.map((element) => (
          <tr key={element.__id}>
            {this.state.options.map((option, i) => this.generateCell(option, element, i))}
          </tr>
        ))}
      </table>
    )
  }
}
