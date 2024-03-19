import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-row-append";

class CustomWebComponent extends LitElement {     
    static styles = css`
        :host {
            display: var(--display);
            box-sizing: border-box;
            border-bottom: 0.1rem solid var(--fx-background-low-contrast);
            grid-column: 1 / -1;
        }
    `;

    constructor(){
        super()
        this.hidden = false
        this.visible = false
        this.append = ""
        this.style.setProperty('--display', 'block')
    }

    static properties = {
        hidden: {attribute: true, type: Boolean},
        visible: {attribute: true, type: Boolean},
        append: {attribute: true, type: String, reflect: true},
    }

    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('rowSelection', this.rowSelection)
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('hidden') || changedProperties.has('visible')){
            if (!this.hidden && this.visible){
                this.style.setProperty('--display', 'block')
            } else {
                this.style.setProperty('--display', 'none')
            }
        }
    }

    render() {
        return html`<slot></slot>`;
    }

}

customElements.define(TAG_NAME, CustomWebComponent);
