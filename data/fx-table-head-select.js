import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-head-select";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            background-color:  color-mix(in srgb, var(--fx-secondary), transparent 60%);
            padding: 0 0.3rem;
            box-sizing: border-box;
            color: var(--fx-secondary-contrast);
            border-bottom: 0.1rem solid var(--fx-background-low-contrast);
            display: flex;
            align-items: center;
            height: 3rem;
        }
        :host(:nth-child(even)) {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.1);
        }
    `;

    selectAll(event){
        const customEvent = new CustomEvent('selectAll', {
            bubbles: true,
            composed: true,
            detail: {
                selected: event.target.value
            }
        })
        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<fx-checkbox @change="${this.selectAll}"></fx-checkbox>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
