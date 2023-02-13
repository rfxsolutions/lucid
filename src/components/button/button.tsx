import { Component, h, JSX, State } from '@stencil/core'

@Component({
  tag: 'lucid-button',
  styleUrl: '../../css/tailwind.css',
  shadow: true
})
export class LucidButton {
  @State() show = false

  render (): JSX.Element {
    return <button class='py-2 px-4 rounded-lg bg-rfx-primary text-white text-sm'>Standard Button</button>
  }
}
