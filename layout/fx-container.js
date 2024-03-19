import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-container";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 1rem;
            box-sizing: border-box;
        }
    `;

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
