import { Constructor } from './ts.mixin'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function LoggerMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    public readonly logger: typeof console = console
  }

  return Mixin
}
