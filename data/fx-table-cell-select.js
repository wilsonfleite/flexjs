import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-cell-select";

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
    }

    static properties = {
        value: {attribute: true, type: Boolean},
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

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('value')){
            const customEvent = new CustomEvent('rowSelection', {
                bubbles: true,
                composed: true,
                detail: {
                    selected: this.value
                }
            })
            this.dispatchEvent(customEvent)
        }
    }

    updateValue(event){
        this.value = event.target.value
    }

    render() {
        return html`<fx-checkbox value="${this.value}" @change="${this.updateValue}"></fx-checkbox>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
