import { Constructor } from './ts.mixin'
export type Fetcher <C, R> = (config: C) => Promise<R>

export interface FetchResults <D> {
  results: D[]
  count: number
}

export type FetchState = 'loading' | 'idle' | 'error'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function FetcherMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    private readonly _fetchTasks: Array<Promise<unknown>> = []
    public fetcher: Fetcher<any, any>
    public fetchState: FetchState = 'idle'
    public data: any = []
    public count: number = 0

    private setFetchState (state: FetchState): void {
      this.fetchState = state
      this.updateFetchState(this.fetchState)
    }

    public updateFetchState (state: FetchState): void {
      console.error('An error occurred overriding updateFetchState in date provider', state)
    }

    public async performFetch (config: any): Promise<FetchResults<any>> {
      try {
        this.setFetchState('loading')
        const fetch = this.fetcher(config)
        this._fetchTasks.push(fetch)

        const resp = await fetch

        void this._fetchTasks.pop()
        if (this._fetchTasks.length === 0) {
          this.setFetchState('idle')
        }

        this.data = resp.results
        this.count = resp.count
        return resp
      } catch (e) {
        void this._fetchTasks.pop()
        this.setFetchState('error')
        console.error(e)
      }
    }
  }

  return Mixin
}
