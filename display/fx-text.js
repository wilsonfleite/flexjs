import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-text'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            position: relative;
            width: 100%;
            border: none;
            min-height: 1.8rem;
            padding: 0;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            overflow: visible;
        }

        .text {
            display: flex;
            align-items: center;
            min-height: 1.5rem;
            width: 100%;
            font-size: 1rem;
            box-sizing: border-box;
            resize: none;
            background-color: transparent;
        }

        .prefix {
            font-size: 0.8rem;
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
        this.prefix = ''
        this.items = []
        this.disabled = false
        this.type = ''
        this.preValue = ''
        this.color = 'var(--fx-background-contrast)'
    }

    static properties = {
        value: {attribute: true, type: String},
        prefix: {attribute: true, type: String},
        label: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        type: {attribute: true, type: String},
        preValue: {attribute: 'pre-value', type: String},
        color: {attribute: true, type: String},
    }

    connectedCallback() {
        super.connectedCallback()
        this._disabled = this.disabled
    }
      
    set value(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._value;
        this._value = val;
        this.requestUpdate('value', oldVal);
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').value = val)
        this._dispatchEvent()
    }
      
    get value() { 
        return this.convertValue(this._value, this.type);
    }

    get text() { 
        return this.convertValue(this._value, this.type);
    }

    set preValue(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._preValue;
        this._preValue = val;
        this.requestUpdate('preValue', oldVal);
        this.shadowRoot && this.shadowRoot.querySelector('input') && (this.shadowRoot.querySelector('input').preValue = val)
        this._dispatchEvent()
    }
      
    get preValue() { 
        return this.convertValue(this._preValue, this.type);
    }

    convertValue(value, type){
        let newValue
        switch(type){
            case 'text':
                newValue = String(value)
                break
            case 'number':
                newValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value)
                break
            default:
                newValue = value
                break
        }
        return newValue
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
    }
      
    get disabled() { 
        return this._disabled
    }

    _dispatchEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
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
        const color = this.disabled ? 'var(--fx-background-low-contrast)' : this.color
        return html`
            <label for="text-input" part="label">${this.label}</label>
            <div class="box">
                <div class="text" id="text-input" part="text" style="color:${color};"><span class="prefix">${this.prefix}</span> ${this.value}</div>
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);