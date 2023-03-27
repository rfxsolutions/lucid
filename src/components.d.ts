/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ButtonPreset, ButtonSize } from "./components/button/types";
export { ButtonPreset, ButtonSize } from "./components/button/types";
export namespace Components {
    interface LucidButton {
        "classes": string[];
        "cursor": string;
        "disabled": boolean;
        "icon": string;
        "label": string;
        "loading": boolean;
        "preset": ButtonPreset;
        "size": ButtonSize;
    }
    interface LucidServerTable {
        "topicId": string;
    }
    interface LucidServerTableData {
        "topicId": string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first": string;
        /**
          * The last name
         */
        "last": string;
        /**
          * The middle name
         */
        "middle": string;
    }
}
export interface LucidButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLLucidButtonElement;
}
declare global {
    interface HTMLLucidButtonElement extends Components.LucidButton, HTMLStencilElement {
    }
    var HTMLLucidButtonElement: {
        prototype: HTMLLucidButtonElement;
        new (): HTMLLucidButtonElement;
    };
    interface HTMLLucidServerTableElement extends Components.LucidServerTable, HTMLStencilElement {
    }
    var HTMLLucidServerTableElement: {
        prototype: HTMLLucidServerTableElement;
        new (): HTMLLucidServerTableElement;
    };
    interface HTMLLucidServerTableDataElement extends Components.LucidServerTableData, HTMLStencilElement {
    }
    var HTMLLucidServerTableDataElement: {
        prototype: HTMLLucidServerTableDataElement;
        new (): HTMLLucidServerTableDataElement;
    };
    interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {
    }
    var HTMLMyComponentElement: {
        prototype: HTMLMyComponentElement;
        new (): HTMLMyComponentElement;
    };
    interface HTMLElementTagNameMap {
        "lucid-button": HTMLLucidButtonElement;
        "lucid-server-table": HTMLLucidServerTableElement;
        "lucid-server-table-data": HTMLLucidServerTableDataElement;
        "my-component": HTMLMyComponentElement;
    }
}
declare namespace LocalJSX {
    interface LucidButton {
        "classes"?: string[];
        "cursor"?: string;
        "disabled"?: boolean;
        "icon"?: string;
        "label"?: string;
        "loading"?: boolean;
        "onOnClick"?: (event: LucidButtonCustomEvent<UIEvent>) => void;
        "preset"?: ButtonPreset;
        "size"?: ButtonSize;
    }
    interface LucidServerTable {
        "topicId"?: string;
    }
    interface LucidServerTableData {
        "topicId"?: string;
    }
    interface MyComponent {
        /**
          * The first name
         */
        "first"?: string;
        /**
          * The last name
         */
        "last"?: string;
        /**
          * The middle name
         */
        "middle"?: string;
    }
    interface IntrinsicElements {
        "lucid-button": LucidButton;
        "lucid-server-table": LucidServerTable;
        "lucid-server-table-data": LucidServerTableData;
        "my-component": MyComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "lucid-button": LocalJSX.LucidButton & JSXBase.HTMLAttributes<HTMLLucidButtonElement>;
            "lucid-server-table": LocalJSX.LucidServerTable & JSXBase.HTMLAttributes<HTMLLucidServerTableElement>;
            "lucid-server-table-data": LocalJSX.LucidServerTableData & JSXBase.HTMLAttributes<HTMLLucidServerTableDataElement>;
            "my-component": LocalJSX.MyComponent & JSXBase.HTMLAttributes<HTMLMyComponentElement>;
        }
    }
}
