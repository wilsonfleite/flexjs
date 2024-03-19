import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-head-row";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: contents;
        }
    `;

    render() {
        return html`<slot></slot>`;
    }

}

customElements.define(TAG_NAME, CustomWebComponent);
