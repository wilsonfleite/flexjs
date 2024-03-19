import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-cell-expand";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            box-sizing: border-box;
            padding: 0.1rem;
            border-bottom: 0.1rem solid var(--fx-background-low-contrast);
            display: flex;
            align-items: center;
        }
        
        :host(:nth-child(even)) {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.1);
        }
    `;

    constructor(){
        super()
        this.value = false
        this.append = ""
        this.textFalse = 'Expandir'
        this.textTrue = 'Recolher'
        this.iconFalse = 'expand_more'
        this.iconTrue = 'expand_less'
    }

    static properties = {
        value: {attribute: true, type: Boolean},
        append: {attribute: true, type: String, reflect: true},
        textTrue: {attribute: 'text-true', type: String},
        textFalse: {attribute: 'text-false', type: String},
        iconTrue: {attribute: 'icon-true', type: String},
        iconFalse: {attribute: 'icon-false', type: String},
    }

    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('mouseover', this.mouseOverHandler)
        this.addEventListener('mouseout', this.mouseOutHandler)
    }

    mouseOverHandler(event){
        const customEvent = new CustomEvent('mouseOverCell', {
            bubbles: true,
            composed: true,
        })
        this.dispatchEvent(customEvent)
    }

    mouseOutHandler(event){
        const customEvent = new CustomEvent('mouseOutCell', {
            bubbles: true,
            composed: true,
        })
        this.dispatchEvent(customEvent)
    }

    updateValue(event){
        this.value = event.target.value
        const rowid = this.closest('fx-table-row').rowid
        const table = this.closest('fx-table')
        if (this.value) {
            table.showRowAppend(rowid, this.append)
        } else {
            table.hideRowAppend(rowid, this.append)
        }
    }

    render() {
        return html`<fx-toggle-text-button @change="${this.updateValue}" value="${this.value}"
        text-true="${this.textTrue}" text-false="${this.textFalse}" icon-true="${this.iconTrue}" icon-false="${this.iconFalse}"></fx-toggle-text-button>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
