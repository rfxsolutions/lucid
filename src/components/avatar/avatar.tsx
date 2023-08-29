import { Component, h, JSX, Prop } from '@stencil/core'
@Component({
  tag: 'lucid-avatar',
  styleUrl: '../../css/tailwind.css',
  shadow: true
})

export class LucidAvatar {
  @Prop() url: string
  @Prop() description?: string

  render (): JSX.Element {
    return <img class='inline-block h-14 w-14 rounded-full' src={this.url} alt={this.description ?? ''} />
  }
}
