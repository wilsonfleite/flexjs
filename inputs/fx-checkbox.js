import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-checkbox'

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
            cursor: pointer;
        }

        .checkbox-box {
            width: 1.6rem;
        }

        input[type=checkbox] {
            cursor: pointer;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            outline: 0;
            font-family: "Material Icons";
            font-size: 1rem;
            font-weight: 700;
            width: 1.1rem;
            height: 1.1rem;
            max-height: 1rem;
            line-height: 1rem;
            border: 0.1rem solid var(--checkbox-backcolor);
            border-radius: 0.3rem;
            margin-right: 0.6rem;
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 40%);
            overflow: hidden;
            padding: 0;
            display: flex;
            align-items: center;
        }
        input[type=checkbox]:checked {
            background: var(--checkbox-backcolor);
        }
        input[type=checkbox]:checked:before {
            content: "done";
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--checkbox-color);
        }

        label {
            font-size: 1rem;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            width: 100%;
        }
    `

    _value = false
    _preValue = false
    _disabled = false

    constructor(){
        super()
        this.value = false
        this.readonly = false
        this.disabled = false
        this.preValue = false
        this.lbcolor = 'var(--fx-background-contrast)'
        this.style.setProperty('--checkbox-backcolor', 'var(--fx-secondary)')
        this.style.setProperty('--checkbox-color', 'var(--fx-secondary-contrast)')
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
        if (val){
            this.style.setProperty('--checkbox-backcolor', 'var(--fx-secondary-dark)')
            this.style.setProperty('--checkbox-color', 'var(--fx-secondary-dark-contrast)')
        } else {
            this.style.setProperty('--checkbox-backcolor', 'var(--fx-secondary)')
            this.style.setProperty('--checkbox-color', 'var(--fx-secondary-contrast)')
        }
    }
      
    get disabled() { 
        return this._disabled
    }

    static properties = {
        value: {attribute: true, converter: 
            {
                fromAttribute: (value, type) => {
                    if (value === undefined || value === 'undefined' || value === '') value = false
                    return JSON.parse(value)
                },
                toAttribute: (value, type) => {
                    return value
                },
            }
        }, 
        preValue: {attribute: 'pre-value', converter: 
            {
                fromAttribute: (preValue, type) => {
                    if (preValue === undefined || preValue === 'undefined') preValue = false
                    return JSON.parse(preValue)
                },
                toAttribute: (preValue, type) => {
                    return preValue
                },
            }
        },
        readonly: {attribute: true, type: Boolean},
        disabled: {attribute: true, type: Boolean},
        lbcolor: {attribute: true, type: String},
    }

    connectedCallback() {
        super.connectedCallback()
    }
      
    set value(val) {
        if (val === undefined || val === 'undefined' || val === null) val = false
        let oldVal = this._value
        this._value = val
        this.requestUpdate('value', oldVal)
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').checked = val)
        this.dispatchChangeEvent()
    }
      
    get value() { 
        return this._value
    }

    set preValue(val) {
        if (val === undefined || val === 'undefined' || val === null) val = false
        let oldVal = this._preValue
        this._preValue = val
        this.requestUpdate('preValue', oldVal)
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').checked = val)
        this.dispatchChangeEvent()
    }
      
    get preValue() { 
        return this._preValue
    }

    get text() { 
        return this.value ? 'Sim' : 'Não'
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    updateInput(event){
        this.value = event.target.checked
    }

    cancelInput(event){
        event.target.checked = !event.target.checked
    }

    clear(){
        this.value = false
    }

    reset(){
        this.value = this._preValue
    }

    setPre(){
        this._preValue = this._value
    }

    get changed(){
        return (this.value !== this.preValue)
    }

    render() {
        return html`
            <div class="box" part="box">
                <div class="checkbox-box">
                    <input type="checkbox" list="input-list" id="text-input" 
                    ?checked="${this.value}" @click="${this.readonly ? this.cancelInput : this.updateInput }" 
                    ?disabled="${this.disabled}" part="checkbox">
                </div>
                <label for="text-input" part="label" style="color: ${this.lbcolor};"><slot></slot></label>
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);