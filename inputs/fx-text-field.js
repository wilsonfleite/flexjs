import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-text-field'

import {DocumentClickEmitter, toTypeValue} from '../fx-core.js'

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
            height: 1.8rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 40%);
        }

        .box:focus-within {
            outline: 0.1rem solid var(--fx-secondary-dark);
            box-shadow: 0 0 0.2rem var(--fx-secondary-dark);
        }

        input {
            outline: none;
            border: none;
            height: 1.5rem;
            width: 100%;
            font-size: 1rem;
            box-sizing: border-box;
            background-color: transparent;
        }

        label {
            font-weight: 500;
            font-size: 0.8rem;
        }

        .prefix {
            font-size: 0.8rem;
        }

        .options-list {
            display: none;
            flex-direction: column;
            border: 0.1rem solid var(--fx-secondary);
            background-color: var(--fx-background-hard);
            width: 100%;
            position: absolute;
            left: 0;
            top: 100%;
            min-width: 110%;
            z-index: 800;
            border-radius: 0.3rem;
        }
    `

    _value = ''
    _disabled = false
    _preValue = ''

    constructor(){
        super()
        this.value = ''
        this.type = ''
        this.prefix = ''
        this.placeholder = ''
        this.label = ''
        this.inputType = 'text'
        this.readonly = false
        this.disabled = false
        this.preValue = ''
        this.lbcolor = 'var(--fx-background-contrast)'
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        value: {attribute: true, type: String},
        type: {attribute: true, type: String},
        prefix: {attribute: true, type: String},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        inputType: {attribute: 'input-type', type: String},
        min: {attribute: true, type: String},
        max: {attribute: true, type: String},
        readonly: {attribute: true, type: Boolean},
        disabled: {attribute: true, type: Boolean},
        preValue: {attribute: 'pre-value', type: String},
        lbcolor: {attribute: true, type: String},
    }

    firstUpdated(){
        this.renderRoot.querySelector('slot').addEventListener('textfieldOptionClicked', this.textfieldOptionClicked.bind(this))
    }

    textfieldOptionClicked(event){
        this.hideOptions()
        this.value = event.target.innerText
    }

    inputClicked(event){
        const slot = this.renderRoot.querySelector('slot')
        const nodes = slot.assignedNodes();
        let hasChildren = false;
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === Node.ELEMENT_NODE) {
              hasChildren = true
              break
            }
        }
        if (hasChildren){
            this.showOptions()
        }
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.hideOptions()
        }
    }

    showOptions(){
        const options = this.renderRoot.querySelector('.options-list')
        options.style.display = 'flex'
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    hideOptions(){
        const options = this.renderRoot.querySelector('.options-list')
        options.style.display = 'none'
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
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
        this.dispatchChangeEvent()
    }

    inputKeyDown(event){
        event.stopPropagation()
        if (event.key == "Enter"){
            let pressEnterEvent = new Event('pressEnter')
            this.dispatchEvent(pressEnterEvent)
        }            
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
                <div class="prefix">${this.prefix}</div>
                <input type="${this.inputType}" list="input-list" id="text-input" value=${this.value} 
                placeholder="${this.placeholder}" @input="${this.updateInput}" @click="${this.inputClicked}" 
                @keydown="${this.inputKeyDown}" ?disabled="${this._disabled}" ?readonly="${this.readonly}" 
                part="input" style="color:${color};" min="${this.min}" max="${this.max}" />
                <div class="options-list"><slot></slot></div>
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);