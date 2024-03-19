import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-textarea'

import {toTypeValue} from '../fx-core.js'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            position: relative;
            width: 100%;
            border: 0.1rem solid var(--fx-secondary);
            border-radius: 0.3rem;
            min-height: 2rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: flex-start;
            box-sizing: border-box;
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 40%);
        }

        .box:focus-within {
            outline: 0.1rem solid var(--fx-secondary-dark);
            box-shadow: 0 0 0.2rem var(--fx-secondary-dark);
        }

        textarea {
            outline: none;
            border: none;
            height: 8rem;
            width: 100%;
            font-size: 1rem;
            box-sizing: border-box;
            resize: none;
            background-color: transparent;
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            font-size: 1rem;
        }

        label {
            font-weight: 500;
            font-size: 0.8rem;
        }

    `

    _value = ''
    _disabled = false
    _preValue = ''

    constructor(){
        super()
        this.value = ''
        this.type = ''
        this.placeholder = ''
        this.label = ''
        this.options = []
        this.readonly = false
        this.disabled = false
        this.preValue = ''
        this.lbcolor = 'var(--fx-background-contrast)'
    }

    static properties = {
        value: {attribute: true, type: String},
        type: {attribute: true, type: String},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        options: {attribute: true, type: Object},
        readonly: {attribute: true, type: Boolean},
        disabled: {attribute: true, type: Boolean},
        preValue: {attribute: 'pre-value', type: String},
        lbcolor: {attribute: true, type: String},
    }

    connectedCallback() {
        super.connectedCallback()
    }
      
    set value(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._value;
        this._value = val;
        this.requestUpdate('value', oldVal);
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').value = val)
        this.dispatchChangeEvent()
    }
      
    get value() { 
        const type = this.type
        return toTypeValue(this._value, type)
    }

    set preValue(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._preValue;
        this._preValue = val;
        this.requestUpdate('preValue', oldVal);
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').preValue = val)
        this.dispatchChangeEvent()
    }
      
    get preValue() { 
        const type = this.type
        return toTypeValue(this._preValue, type)
    }

    get text(){
        const type = this.type
        return toTypeValue(this._value, 'text')
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
    }
      
    get disabled() { 
        return this._disabled
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    updateInput(event){
        this._value = event.target.value
    }

    clear(){
        this.value = ''
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
        const color = this.disabled ? 'var(--fx-background-low-contrast)' : 'var(--fx-background-contrast)'
        return html`
            <label for="box" part="label" style="color: ${this.lbcolor};">${this.label}</label>
            <div class="box" part="box" id="box">
                <textarea 
                    placeholder="${this.placeholder}" @input="${this.updateInput}" 
                    ?disabled="${this._disabled}" ?readonly="${this.readonly}" 
                    part="textarea" style="color:${color};">${this.value}</textarea>
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);