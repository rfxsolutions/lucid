import { Component, h, JSX, Prop, Element } from '@stencil/core'

@Component({
  tag: 'lucid-server-table',
  styleUrl: '../../css/tailwind.css',
  shadow: true
})

export class LucidButton {
  @Prop() storeId: string | null = null
  @Element() host: HTMLElement

  componentWillLoad (): void {}

  render (): JSX.Element {
    return <table />
  }
}
