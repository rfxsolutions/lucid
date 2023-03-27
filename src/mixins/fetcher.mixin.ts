import { Constructor } from './ts.mixin'
export type Fetcher <C, R> = (config: C) => Promise<R>

export interface FetchResults <D> {
  results: D[]
  count: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function FetcherMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    private readonly _fetchTasks: Array<Promise<unknown>> = []
    public fetcher: Fetcher<any, any>
    public fetchState: 'loading' | 'idle' | 'error' = 'idle'
    public data: any = []
    public count: number = 0

    public async performFetch (config: any): Promise<void> {
      try {
        this.fetchState = 'loading'
        const fetch = this.fetcher(config)
        this._fetchTasks.push(fetch)

        const resp = await fetch

        void this._fetchTasks.pop()
        if (this._fetchTasks.length === 0) {
          this.fetchState = 'idle'
        }

        this.data = resp.results
        this.count = resp.count
      } catch (e) {
        void this._fetchTasks.pop()
        this.fetchState = 'error'
        console.error(e)
      }
    }
  }

  return Mixin
}
