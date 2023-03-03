import { Config } from '@stencil/core'
import tailwind from 'stencil-tailwind-plugin'
import tailwindConf from './tailwind.config'
import { angularOutputTarget } from '@stencil/angular-output-target';

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
      serviceWorker: null // disable service workers
    },
    angularOutputTarget({
      componentCorePackage: '@rfxsolutions/lucid',
      directivesProxyFile: '../lucid-angular/projects/component-library/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../lucid-angular/projects/component-library/src/lib/stencil-generated/index.ts',
      includeImportCustomElements: true
    }),
  ],
  plugins: [
    tailwind({
      tailwindConf: tailwindConf as any
    })
  ],
  devServer: {
    reloadStrategy: 'pageReload'
  }
}
