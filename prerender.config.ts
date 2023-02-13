import { PrerenderConfig } from '@stencil/core'
export const config: PrerenderConfig = {
  crawlUrls: false,
  entryUrls: ['http://localhost:3333/'],
  hydrateOptions: _url => {
    return {
      runtimeLogging: true
    }
  }
}
