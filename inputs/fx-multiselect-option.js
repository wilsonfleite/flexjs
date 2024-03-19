import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-multiselect-option'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            text-wrap: nowrap;
        }
        .option {
            box-sizing: border-box;
            width: 100%;
        }
        .option:hover {
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
        }
        fx-checkbox {
            display: block;
            width: 100%;
            height: 100%;
        }
    `

    static properties = {
        checked: {attribute: true, type: Boolean},
        value: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        readonly: {attribute: true, type: Boolean},
    }

    checkboxClicked(event){
        if (!this.disabled && !this.readonly){
            const newValue = this.renderRoot.querySelector('fx-checkbox').value
            if (this.checked != newValue){
                this.checked = newValue
                let clickEvent = new Event('multiselectOptionClicked', { bubbles: true })
                this.dispatchEvent(clickEvent)
            }
        }
    }

    render() {
        return html`<div class="option" @click=${this.checkboxClicked}>
            <fx-checkbox value="${this.checked}" ?readonly="${this.readonly}" ?disabled="${this.disabled}" style="user-select: none;"><slot></slot></fx-checkbox>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);