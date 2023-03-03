import { Component, h, JSX, Prop, State, Element, Event, EventEmitter } from '@stencil/core'
import { ButtonSize, ButtonType } from './types'

@Component({
  tag: 'lucid-button',
  styleUrl: '../../css/tailwind.css',
  shadow: true
})

export class LucidButton {
  @Event() onClick: EventEmitter<UIEvent>
  @State() show = false
  @Prop() label: string
  @Prop() disabled = false
  @Prop() size: ButtonSize = ButtonSize.md
  @Prop() type: ButtonType = ButtonType.primary
  @Element() host: HTMLElement

  // private iconLeftSlot: HTMLElement
  // private iconRightSlot: HTMLElement
  // private defaultSlot: HTMLElement

  componentWillLoad (): void {
    // this.iconLeftSlot = this.host.querySelector("[slot='left-icon']")
    // this.iconRightSlot = this.host.querySelector("[slot='right-icon']")
    // this.defaultSlot = this.host.querySelector("[slot='default']")
  }

  handleClickEvent (event: UIEvent): void {
    this.onClick.emit(event)
  }

  stylingProperty (type: ButtonType, size: ButtonSize): string {
    let styleSize: string = ''
    switch (size) {
      case ButtonSize.md:
        styleSize = 'py-3 px-6 text-xs'
        break
      case ButtonSize.lg:
        styleSize = 'py-3 px-8 text-sm'
        break
      case ButtonSize.xl:
        styleSize = 'py-3 px-10'
        break
    }

    switch (type) {
      case ButtonType.primary:
        return `rounded-md bg-primary ${styleSize} font-normal text-white hover:drop-shadow-custom font-inter flex space-x-0 items-center`
      case ButtonType.secondary:
        return `rounded-md bg-white ${styleSize} font-normal text-slate-700 border border-slate-300 hover:drop-shadow-custom font-inter`
      default:
        return 'rounded-md bg-primary py-3 px-6 text-xs font-normal text-white hover:drop-shadow-custom font-inter'
    }
  }

  render (): JSX.Element {
    return <button onClick={this.handleClickEvent.bind(this)} class={this.stylingProperty(this.type, this.size)}> {this.label}</button>
  }
}
