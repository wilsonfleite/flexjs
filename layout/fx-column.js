import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-column";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: flex; 
            height: 100%;
            width: 100%;
        }

        .slot {
            display: flex; 
            flex-direction: column; 
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
        }
    `;

    static properties = {
        gap: {attribute: true, type: String},
    }

    render() {
        const gap = this.gap ?? "0"
        return html`<div class="slot" style="gap: ${gap};"><slot></slot></div>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
