import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-cell";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            box-sizing: border-box;
            border-bottom: 0.1rem solid var(--fx-background-low-contrast);
            grid-column: var(--colspan);
            grid-row: var(--rowspan);
        }

        :host(:nth-child(even)) {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.1);
        }

        .background {
            width: 100%;
            box-sizing: border-box;
            background-color: var(--background);
            display: flex;
            height: 2rem;
            align-items: center;
            padding: 0 0.1rem;
        }

        ::slotted(*){
            width: 100%;
        }
    `;

    constructor(){
        super()
        this.style.setProperty('--background', 'none')
        this.style.setProperty('--colspan', 'span 1')
        this.style.setProperty('--rowspan', 'span 1')
        this.changed = false
        this.hidden = false
        this.colspan = 1
        this.rowspan = 1
    }

    static properties = {
        compare: {attribute: true, type: Boolean},
        hidden: {attribute: true, type: Boolean},
        changed: {attribute: true, type: Boolean},
        colspan: {attribute: true, type: Number},
        rowspan: {attribute: true, type: Number},
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('colspan')){
            this.style.setProperty('--colspan', `span ${this.colspan}`)
        }
        if (changedProperties.has('rowspan')){
            this.style.setProperty('--rowspan', `span ${this.rowspan}`)
        }
    }

    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('change', this.compareValues)
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

    firstUpdated(){
        this.compareValues()
    }

    compareValues(event = null){
        if (this.compare){
            const rowStatus = this.closest('fx-table-row').status
            if (rowStatus != 'added'){
                if (this.updatedValue()){
                    this.style.setProperty('--background', 'var(--fx-updated)')
                    this.changed = true
                } else {
                    this.style.setProperty('--background', 'transparent')
                    this.changed = false
                }
            }
        }
    }

    updatedValue(){
        const childElement = this.firstElementChild;
        return childElement.changed
    }

    get value(){
        const childElement = this.firstElementChild;
        const val = (childElement && 'value' in childElement) ? childElement.value : '';
        return val;
    }

    set value(val){
        const childElement = this.firstElementChild;
        if (childElement && 'value' in childElement) {
            childElement.value = val;
        }
    }

    get text(){
        const childElement = this.firstElementChild;
        const val = (childElement && 'text' in childElement) ? childElement.text : '';
        return val;
    }

    render() {
        return html`<div class="background"><slot></slot></div>`;
    }

}

customElements.define(TAG_NAME, CustomWebComponent);
