import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-radio-option'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            width: 100%;
            height: 1.8rem;
            padding: 0;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        input[type=radio] {
            cursor: pointer;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;
            width: 1.1rem;
            height: 1.1rem;
            border: 0.13rem solid var(--radio-backcolor);
            border-radius: 50%;
            margin-right: 0.6rem;
            position: relative;  
            box-sizing: border-box;
        }
        input[type=radio]:checked {
            background: var(--radio-backcolor);
            box-shadow: inset 0 0 0 0.15rem var(--fx-background); 
        }

        label {
            font-size: 1rem;
            cursor: pointer;
        }
    `

    _disabled = false
    _checked = false

    constructor(){
        super()
        this.value = false
        this.readonly = false
        this.disabled = false
        this.lbcolor = 'var(--fx-background-contrast)'
        this.style.setProperty('--radio-backcolor', 'var(--fx-secondary)')
        this.style.setProperty('--radio-color', 'var(--fx-secondary-contrast)')
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
        if (val){
            this.style.setProperty('--radio-backcolor', 'var(--fx-secondary-dark)')
            this.style.setProperty('--radio-color', 'var(--fx-secondary-dark-contrast)')
        } else {
            this.style.setProperty('--radio-backcolor', 'var(--fx-secondary)')
            this.style.setProperty('--radio-color', 'var(--fx-secondary-contrast)')
        }
    }
      
    get disabled() { 
        return this._disabled
    }

    static properties = {
        checked: {attribute: true, type: Boolean},
        value: {attribute: true, type: String},
        readonly: {attribute: true, type: Boolean},
        disabled: {attribute: true, type: Boolean},
        lbcolor: {attribute: true, type: String},
    }

    set checked(val) {
        if (val === undefined || val === 'undefined' || val === null) val = false
        let oldVal = this._checked
        this._checked = val
        this.requestUpdate('checked', oldVal)
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').checked = val)
        this.dispatchChangeEvent()
    }
      
    get checked() { 
        return this._checked
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    updateInput(event){
        this.checked = event.target.checked
    }

    cancelInput(event){
        event.target.checked = this.checked
    }

    render() {
        return html`
            <div class="box" part="box">
                <input type="radio" list="input-list" id="radio-input" 
                ?checked="${this.checked}" @click="${this.readonly ? this.cancelInput : this.updateInput }" 
                ?disabled="${this.disabled}" part="radio">
                <label for="radio-input" part="label" style="color: ${this.lbcolor};"><slot></slot></label>
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);