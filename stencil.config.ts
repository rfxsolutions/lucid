import { Config } from '@stencil/core'
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin'
import tailwindConf from './tailwind.config'
export const config: Config = {
  namespace: 'lucid',
  globalStyle: 'src/css/tailwind.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      baseUrl: 'http://localhost:3333',
      serviceWorker: null, // disable service workers,
      copy: [
        { src: 'pages' },
        { src: 'css' }
      ]
    }
  ],
  plugins: [
    tailwind({
      tailwindConf: tailwindConf as any
    }),
    tailwindHMR()
  ],
  devServer: {
    reloadStrategy: 'pageReload'
  }
}
