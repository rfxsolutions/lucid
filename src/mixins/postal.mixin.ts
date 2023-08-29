import postal from 'postal'
import { Constructor } from './ts.mixin'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function PostalMixin <T extends Constructor> (Base: T) {
  class Mixin extends Base {
    public providerId: string
    public channel: ReturnType<typeof postal.channel> = postal.channel('UNSET')
    public readonly subscriptions: Array<ReturnType<typeof postal.subscribe>> = []

    public destroy (): void {
      this.subscriptions.forEach(sub => sub.unsubscribe())
    }
  }

  return Mixin
}
