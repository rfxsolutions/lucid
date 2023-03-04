import { Component, h, JSX, Prop, State, Element, Event, EventEmitter } from '@stencil/core'
import { ButtonPreset, ButtonSize } from './types'

@Component({
  tag: 'lucid-button',
  styleUrl: '../../css/tailwind.css',
  shadow: false
})

export class LucidButton {
  @Event() onClick: EventEmitter<UIEvent>
  @State() show = false
  @Prop() label: string
  @Prop() icon: string
  @Prop() cursor = 'cursor-pointer'
  @Prop() disabled: boolean = false
  @Prop() loading: boolean = false
  @Prop() size: ButtonSize = 'md'
  @Prop() preset: ButtonPreset = 'primary'
  @Prop() classes: string[] = []
  @Element() host: HTMLElement

  private iconRightSlot: HTMLElement
  private iconLeftSlot: HTMLElement
  private fabIconSlot: HTMLElement

  componentWillLoad (): void {
    this.iconRightSlot = this.host.querySelector("[slot='right-icon']")
    this.iconLeftSlot = this.host.querySelector("[slot='left-icon']")
    this.fabIconSlot = this.host.querySelector("[slot='fab-icon']")
  }

  handleClickEvent (event: UIEvent): void {
    console.log('this')
    this.onClick.emit(event)
    event.stopImmediatePropagation()
  }

  get isFab (): boolean {
    return this.preset === 'fab'
  }

  get isIcon (): boolean {
    return this.preset === 'icon'
  }

  get showLoading (): boolean {
    return this.loading && !this.disabled
  }

  get buttonSize (): string {
    switch (this.size) {
      case 'md':
        return 'py-3 px-6 text-xs'
      case 'lg':
        return 'py-3 px-8 text-sm'
      case 'xl':
        return 'py-3 px-10'
      default:
        return 'py-3 px6 text-xs'
    }
  }

  get presetClasses (): string [] {
    switch (this.preset) {
      case 'primary': {
        const primary = [`inline-flex items-center rounded-md bg-primary ${this.buttonSize} font-normal text-white border border-primary hover:drop-shadow-button`, this.cursor]
        const disabledPrimary = ['bg-gray-400 text-white rounded bg-red']
        return this.disabled ? disabledPrimary : primary
      }
      case 'secondary': {
        const secondary = [`inline-flex items-center rounded-md bg-white ${this.buttonSize} font-normal text-slate-700 border border-slate-300 hover:drop-shadow-button`, this.cursor]
        const disabledSecondary = ['bg-gray-200 gray-600 rounded']
        return this.disabled ? disabledSecondary : secondary
      }
      case 'ghost': {
        const ghost = [`inline-flex items-center rounded-md bg-slate-50 ${this.buttonSize} font-normal text-slate-700 border border-slate-50 hover:drop-shadow-button`, this.cursor]
        const disabledGhost = ['bg-gray-200 gray-600 rounded']
        return this.disabled ? disabledGhost : ghost
      }
      case 'tab':
        return ['bg-btn-tab text-primary capitalize p-1 py-2.5 py-2 brightness-100 rounded', this.cursor]
      case 'link':
        return ['bg-transparent text-primary capitalize p-1 py-2.5 py-2 brightness-200 hover:brightness-90 rounded', this.cursor]
      case 'fab': {
        const primary = ['p-0 w-9 h-9 bg-primary text-white hover:brightness-90 hover:shadow-xl rounded-full ripple-bg-primary', this.cursor]
        const disabledPrimary = ['p-0 w-9 h-9 bg-gray-400 text-white rounded-full']
        return this.disabled ? disabledPrimary : primary
      }
      case 'icon': {
        const primary = [`inline-flex items-center rounded-md bg-primary ${this.buttonSize} font-normal text-white border border-primary hover:drop-shadow-button`, this.cursor]
        const disabledPrimary = ['m-1 text-gray-400 rounded']
        return this.disabled ? disabledPrimary : primary
      }
      default:
        return ['bad-button-preset bg-red, text-blue']
    }
  }

  mergedClasses (): string {
    const filteredPresets = this.presetClasses.flatMap(c => c.split(' ')).filter(presetClass => {
      const overwriteTextClass = this.classes.some(classOverride => presetClass.startsWith('text-') && classOverride.startsWith('text-'))
      if (overwriteTextClass) {
        return false
      }
      return true
    })
    return `${filteredPresets.join(' ')} ${this.classes.join(' ')}`
  }

  render (): JSX.Element {
    return (
      <div class='flex group'>
        {!this.isIcon &&
          <button class={`flex flex-row ${this.mergedClasses()}`} type='button' disabled={this.disabled}>
            {!this.isFab &&
              <span class='ml-2 mr-3'>
                {this.showLoading && <i class='mr-1 ml-1 fas fa-circle-notch fa-spin' />}
                {this.label}
              </span>}
            {(this.isFab && this.fabIconSlot != null) && <slot name='fab-icon' />}
          </button>}
        {this.isIcon &&
          <button class={`flex flex-row ${this.mergedClasses()}`} type='button' disabled={this.disabled}>
            {this.iconLeftSlot != null && <slot name='left-icon' />}
            {this.label}
            {this.iconRightSlot != null && <slot name='right-icon' />}
          </button>}
      </div>
    )
  }
}
