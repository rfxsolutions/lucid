/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import type { Components } from '@rfxsolutions/lucid/dist/components';

import { defineCustomElement as defineLucidButton } from '@rfxsolutions/lucid/dist/components/lucid-button.js';
import { defineCustomElement as defineMyComponent } from '@rfxsolutions/lucid/dist/components/my-component.js';
@ProxyCmp({
  defineCustomElementFn: defineLucidButton,
  inputs: ['disabled', 'label', 'size', 'type']
})
@Component({
  selector: 'lucid-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'label', 'size', 'type'],
})
export class LucidButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['onClick']);
  }
}


export declare interface LucidButton extends Components.LucidButton {

  onClick: EventEmitter<CustomEvent<UIEvent>>;
}


@ProxyCmp({
  defineCustomElementFn: defineMyComponent,
  inputs: ['first', 'last', 'middle']
})
@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['first', 'last', 'middle'],
})
export class MyComponent {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface MyComponent extends Components.MyComponent {}


