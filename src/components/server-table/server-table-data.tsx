import { Component, h, JSX, Prop, State } from '@stencil/core'
import { cacheExchange, createClient, dedupExchange, fetchExchange, gql } from '@urql/core'
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
  @Prop() providerId: string
  @State() provider: ServerTableDataProvider<D>

  client = createClient({
    url: 'https://rickandmortyapi.com/graphql',
    exchanges: [dedupExchange, cacheExchange, fetchExchange]
  })

  constructor () {
    const fetcher = async (config: ServerTableFetcherConfig<D>): Promise<{ results: D[], count: number }> => {
      const page = (config.filter.skip / config.filter.limit) + 1
      const variables = {
        page,
        filter: {
          name: config.filter.search ?? null
        }
      }
      const query = gql(`
        query Characters ($page: Int! $filter: FilterCharacter!) {
          characters(page: $page, filter: $filter) {
            info {
              count
            }
            results {
              id
              name
              status
              species
              gender
              image
            }
          }
        }
      `)
      const { data } = await this.client.query(query, variables).toPromise()

      return {
        results: data?.characters?.results ?? [],
        count: data?.characters?.info.count ?? 0
      }
    }
    this.provider = new ServerTableDataProvider({
      uid: this.providerId,
      options: [
        {
          label: 'Id',
          key: 'id',
          breakpoint: 'lg',
          width: [
            {
              breakpoint: 'lg',
              size: 1
            }
          ]
        },
        {
          label: 'Character',
          key: 'name',
          width: [
            {
              breakpoint: 'lg',
              size: 6
            }
          ]
        },
        {
          label: 'Status',
          key: 'status',
          width: [
            {
              breakpoint: 'lg',
              size: 1
            }
          ]
        },
        {
          label: 'Species',
          key: 'species',
          breakpoint: 'md',
          width: [
            {
              breakpoint: 'lg',
              size: 2
            },
          ]
        },
        {
          label: 'Gender',
          key: 'gender',
          breakpoint: '2xl',
          width: [
            {
              breakpoint: 'lg',
              size: 1
            }
          ]
        },
        {
          custom: 'templates',
          id: 'custom-avatar',
          width: [
            {
              breakpoint: 'lg',
              size: 1
            }
          ]
        }
      ],
      defaultData: [{
        name: 'Test'
      } as any],
      defaultPaging: {
        skip: 0,
        limit: 20
      },
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
