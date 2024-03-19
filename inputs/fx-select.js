import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-select'

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

        .expand-icon {
            cursor: default;
        }

        .expand-icon::part(icon) {
            font-size: 1.4rem;
            color: var(--fx-secondary);
            cursor: pointer;
        }

        label {
            font-weight: 500;
            font-size: 0.8rem;
        }

        .select-header {
            width: 100%;
            height: 1.8rem;
            display: flex;
            align-items: center;
        }

        .options-list {
            display: none;
            box-sizing: border-box;
            position: absolute;
            padding: 0.1rem;
            left: 0;
            top: 100%;
            min-width: 100%;
            border: 0.1rem solid var(--fx-secondary);
            background-color: var(--fx-background-hard);
            border-radius: 0.3rem;
            z-index: 800;
            max-height: 20rem;
            overflow: scroll;
        }

        .search-box {
            display: block;
            margin: 0 0 0.4rem 0;
        }

        .search-box::part(box):focus-within {
            box-shadow: none;
            outline: none;
        }

        .placeholder {
            color: var(--fx-background-low-contrast);
        }

        .not-show {
            display: none;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .disabled {
            color: var(--fx-background-low-contrast);
        }

        .header {
            text-wrap: nowrap;
        }
    `
    _value = ''
    _preValue = ''

    constructor(){
        super()
        this.value = ''
        this.preValue = ''
        this.type = 'text'
        this.disabled = false
        this.search = false
        this.lbcolor = 'var(--fx-background-contrast)'
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        value: {attribute: true, type: String},
        preValue: {attribute: 'pre-value', type: String},
        labelValue: {attribute: 'label-value', type: String},
        type: {attribute: true, type: String},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        readonly: {attribute: true, type: Boolean},
        search: {attribute: true, type: Boolean},
        lbcolor: {attribute: true, type: String},
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.hideOptions()
        }
    }

    firstUpdated(){
        this.setHandles()
    }

    handleSlotChange(e) {
        this.setOptionLabel()
    }

    set value(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._value
        this._value = val
        this.requestUpdate('value', oldVal)
        this.dispatchChangeEvent()
        this.setOptionLabel()
    }
      
    get value() { 
        return toTypeValue(this._value, this.type)
    }

    set preValue(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._preValue
        this._preValue = val
        this.requestUpdate('preValue', oldVal)
        this.dispatchChangeEvent()
    }
      
    get preValue() { 
        return toTypeValue(this._preValue, this.type)
    }

    get text() { 
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-SELECT-OPTION');
        const selectedOption = options.find(item => item.value == this.value)
        return selectedOption ? selectedOption.innerText : ''
    }

    setHandles(){
        const selectHeader = this.shadowRoot.querySelector('.select-header')
        const expandButton = this.shadowRoot.querySelector('.expand-icon')
        const search = this.shadowRoot.querySelector('.search-box')
        const slot = this.renderRoot.querySelector('slot')
        
        slot.addEventListener('selectOptionClicked', this.selectOptionClicked.bind(this))
        selectHeader.addEventListener('click', (event) => this.showOptions())
        expandButton.addEventListener('click', (event) => this.showOptions())

        search.addEventListener('change', (event)=> {
            if (!this.disabled) { this.filterOptions(event.target.value) }
        })
    }

    selectOptionClicked(event){
        if (!this.readonly && !this.disabled){
            this.hideOptions()
            this.value = event.target.value
        }
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    showOptions(){
        const options = this.renderRoot.querySelector('.options-list')
        options.style.display = 'block'
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    hideOptions(){
        const options = this.renderRoot.querySelector('.options-list')
        options.style.display = 'none'
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
    }

    selectValue(event){
        this.value = this._getOptionByLabel(event.target.innerText)
        this.hideOptions()
    }

    filterOptions(text){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-SELECT-OPTION');
        options.forEach(option => {
            if (text == '') {
                option.style.display = 'block'
            } else {
                if (option.innerText.toUpperCase().includes(text.toUpperCase())){
                    option.style.display = 'block'
                } else {
                    option.style.display = 'none'
                }
            }
        });
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

    setOptionLabel(){
        if (this.renderRoot && this.renderRoot.querySelector('slot')){
            const slot = this.renderRoot.querySelector('slot')
            const optionItems = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-SELECT-OPTION');
            const optionSelected = optionItems.find(item => item.value == this.value)
            if (optionSelected){
                this.labelValue = optionSelected.innerText
            }
        }
    }

    //Render
    generateHeader(){
        const placeholder = this.placeholder
        let header

        if (this.value.length == 0){
            header = html`<span class="header placeholder">${placeholder}</span>`
        } else {
            header = html`<span class="header ${this.disabled ? 'disabled' : ''}">${this.labelValue}</span>`
        }

        return header
    }

    render() {
        return html`
            <label for="box" part="label" style="color: ${this.lbcolor};">${this.label}</label>
            <div class="box" part="box" id="box">
                <div part="header" class="select-header">${this.generateHeader()}</div>
                <fx-icon class="expand-icon" icon="expand_more"></fx-icon>
                <div class="options-list">
                    <fx-text-field class="search-box ${ this.search ? '' : 'not-show' }" placeholder="Buscar"></fx-text-field>
                    <ul class="${this.disabled || this.readonly ? 'disabled' : ''}"><slot @slotchange="${this.handleSlotChange}"></slot></ul>
                </div>
            </div>
            `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);