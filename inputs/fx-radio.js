import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-radio'

import {toTypeValue} from '../fx-core.js'

class CustomWebComponent extends LitElement {
      
    static styles = css`
    `

    _value = null
    _preValue = false
    _disabled = false
    _readonly = false

    constructor(){
        super()
        this.value = null
        this.label = ''
        this.readonly = false
        this.disabled = false
        this.preValue = false
    }

    static properties = {
        value: {attribute: true, type: String},
        preValue: {attribute: 'pre-value', String},
        label: {attribute: true, type: String},
        readonly: {attribute: true, type: Boolean},
        disabled: {attribute: true, type: Boolean},
    }

    set value(val) {
        let oldVal = this._value
        this._value = val
        this.requestUpdate('value', oldVal)
        if (this.shadowRoot){
            this.setChildrenRadioProperties()
        }
        this.dispatchChangeEvent()
    }
      
    get value() { 
        return this._value
    }

    set preValue(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._preValue;
        this._preValue = val;
        this.requestUpdate('preValue', oldVal);
        this.dispatchChangeEvent()
    }
      
    get preValue() { 
        const type = this.type
        return toTypeValue(this._preValue, type)
    }

    get text(){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-RADIO-OPTION');
        const checkedOption = options.find(item => item.value == this.value)
        return checkedOption ? checkedOption.innerText : ''
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
        if (this.shadowRoot) this.setChildrenRadioProperties()
    }
      
    get disabled() { 
        return this._disabled
    }

    set readonly(val) {
        let oldVal = this._readonly
        this._readonly = val
        this.requestUpdate('readonly', oldVal)
        if (this.shadowRoot) this.setChildrenRadioProperties()
    }
      
    get readonly() { 
        return this._readonly
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    slotChangeHandler(event){
        const target = event.target
        if (target.tagName == 'FX-RADIO-OPTION'){
            if (target.checked){
                this.value = target.value
            }
        }
    }

    setChildrenRadioProperties(){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-RADIO-OPTION');
        options.forEach(option => {
            if (option.value == this.value) {
                if (!option.checked) option.checked = true
            } else {
                if (option.checked) option.checked = false
            }
            option.disabled = this.disabled
            option.readonly = this.readonly
        });
    }

    firstUpdated(){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-RADIO-OPTION');
        this.setChildrenRadioProperties()
        this.renderRoot.querySelector('slot').addEventListener('change', this.slotChangeHandler.bind(this))
    }

    clear(){
        this.value = null
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
        return html`<slot></slot>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);