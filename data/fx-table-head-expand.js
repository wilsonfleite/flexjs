import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-head-expand";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            background-color:  var(--fx-secondary);
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

    constructor(){
        super()
        this.append = ""
        this.textFalse = 'Expandir'
        this.textTrue = 'Recolher'
        this.iconFalse = 'expand_more'
        this.iconTrue = 'expand_less'
    }

    static properties = {
        append: {attribute: true, type: String},
        textTrue: {attribute: 'text-true', type: String},
        textFalse: {attribute: 'text-false', type: String},
        iconTrue: {attribute: 'icon-true', type: String},
        iconFalse: {attribute: 'icon-false', type: String},
    }

    expandAll(event){
        const value = event.target.value
        const customEvent = new CustomEvent('expandAppendAll', {
            bubbles: true,
            composed: true,
            detail: {
                visible: value,
                append: this.append
            }
        })
        this.dispatchEvent(customEvent)
    }

    render() {
        return html`<fx-toggle-text-button @change="${this.expandAll}"
        text-true="${this.textTrue}" text-false="${this.textFalse}" icon-true="${this.iconTrue}" icon-false="${this.iconFalse}" 
        color="var(--fx-secondary-contrast)"></fx-toggle-text-button>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
