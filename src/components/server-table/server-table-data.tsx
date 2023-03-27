import { Component, h, JSX, Prop, State } from '@stencil/core'
import { ServerTableDataProvider } from './data-providers'
import { ServerTableFetcherConfig } from './types'

@Component({
  tag: 'lucid-server-table-data',
  styleUrl: '../../css/tailwind.css',
  shadow: true,
  assetsDirs: [
    'data-providers/server-table.data-provider'
  ]
})

export class LucidServerTableData<D extends Record<string, any>> {
  @Prop() topicId: string
  @State() provider: ServerTableDataProvider<D>

  connectedCallback (): void {
    const fetcher = async (config: ServerTableFetcherConfig<D>): Promise<{ results: D[], count: number }> => {
      const resp = await fetch('https://rickandmortyapi.com/api/character')
      const json = await resp.json()
      const results: D[] = json?.results ?? []
      return {
        results,
        count: results.length
      }
    }
    this.provider = new ServerTableDataProvider({
      uid: this.topicId,
      options: [
        {
          label: 'Id',
          key: 'id'
        },
        {
          label: 'Character',
          key: 'name'
        },
        {
          label: 'Status',
          key: 'status'
        },
        {
          label: 'Species',
          key: 'species'
        },
        {
          label: 'Gender',
          key: 'gender'
        },
        {
          label: 'Image',
          key: 'image',
          custom: true,
          customElementSelector: 'img',
          customAttributeKey: 'src'
        }
      ],
      defaultData: [{
        name: 'Test'
      } as any],
      fetcher
    })
  }

  async componentWillLoad (): Promise<void> {
    await this.provider.load()
  }

  render (): JSX.Element {
    return <table />
  }
}
