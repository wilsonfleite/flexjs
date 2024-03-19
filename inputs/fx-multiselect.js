import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-multiselect'

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
            min-width: 100%;
            height: 1.8rem;
            display: flex;
            align-items: center;
            gap: 0.1rem;
            justify-content: space-between;
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

        .option-selected-multiple {
            box-sizing: border-box;
            border-radius: 5px;
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
            margin: auto 0;
            padding: 0.1rem 0.3rem;
            height: 85%;
            display: flex;
            align-items: center;
            cursor: pointer;
        }

        .remove-option {
            margin-left: 0.3rem;
            cursor: pointer;
        }

        .remove-option::part(icon) {
            opacity: .6;
            font-size: 18px;
        }

        .remove-option::part(icon):hover {
            opacity: 1;
        }

        .not-show {
            display: none;
        }

        .select-all {
            display: flex;
            cursor: pointer;
            text-wrap: nowrap;
        }

        .select-all:hover {
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
        }

        .tags {
            display: flex;
            align-items: center;
            gap: 0.1rem;
        }
    `
    _value = []
    _preValue = []
    _readonly = false
    _disabled = false

    constructor(){
        super()
        this.value = []
        this.preValue = []
        this.type = 'text'
        this.disabled = false
        this.search = false
        this.maxValuesVisible = 1
        this.selectAll = false
        this.lbcolor = 'var(--fx-background-contrast)'
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        value: {attribute: true, type: Object},
        preValue: {attribute: 'pre-value', type: Object},
        type: {attribute: true, type: String},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        readonly: {attribute: true, type: Boolean},
        search: {attribute: true, type: Boolean},
        maxValuesVisible: {attribute: 'max-values-visible', type: Number},
        selectAll: {attribute: 'select-all', type: Boolean},
        lbcolor: {attribute: true, type: String},
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
        if (this.shadowRoot) this.setChildrenOptionsProperties()
    }
      
    get disabled() { 
        return this._disabled
    }

    set readonly(val) {
        let oldVal = this._readonly
        this._readonly = val
        this.requestUpdate('readonly', oldVal)
        if (this.shadowRoot) this.setChildrenOptionsProperties()
    }
      
    get readonly() { 
        return this._readonly
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.hideOptions()
        }
    }

    setChildrenOptionsProperties(){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION');
        options.forEach(option => {
            option.disabled = this.disabled
            option.readonly = this.readonly
        });
    }

    firstUpdated(){
        this.setHandles()
        this.shadowRoot.addEventListener('slotchange', this.requestUpdate())
        this.setOptionsValue()
        this.setChildrenOptionsProperties()
    }

    set value(val) {
        if (val === undefined || val === null || val === 'undefined') val = ''
        let oldVal = this._value
        this._value = val
        this.requestUpdate('value', oldVal)
        this.setOptionsValue()
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
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION');
        const checkedOptions = options.filter(item => item.checked)
        let response = checkedOptions.map(item => item.innerText)
        return response.sort()
    }

    setHandles(){
        const selectHeader = this.shadowRoot.querySelector('.select-header')
        const expandButton = this.shadowRoot.querySelector('.expand-icon')
        const search = this.shadowRoot.querySelector('.search-box')
        const slot = this.renderRoot.querySelector('slot')
        const selectAllOptions = this.shadowRoot.querySelector('.select-all')

        slot.addEventListener('multiselectOptionClicked', this.multiselectOptionClicked.bind(this))
        selectHeader.addEventListener('click', (event) => this.showOptions())
        expandButton.addEventListener('click', (event) => this.showOptions())
        selectAllOptions.addEventListener('change', (event) => this.selectAllOptions(event))

        search.addEventListener('change', (event)=> {
            if (!this.disabled) { this.filterOptions(event.target.value) }
        })
    }

    selectAllOptions(event){
        if (!this.readonly && !this.disabled){
            const slot = this.renderRoot.querySelector('slot')
            const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION');
            this._value = []
            options.forEach(option => {
                option.checked = event.target.value
                if (event.target.value) this._value.push(option.value)
            });
            this.requestUpdate()
        }
    }

    multiselectOptionClicked(event){
        if (!this.readonly && !this.disabled){
            const option = event.target
            const optionValue = option.value
            if (option.checked){
                this._value.push(optionValue)
            } else {
                this._value = this._value.filter(item => item != optionValue)
            }
            this.requestUpdate()
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

    filterOptions(text){
        const slot = this.renderRoot.querySelector('slot')
        const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION');
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
        this.value = []
    }

    reset(){
        this.value = this._preValue
    }

    setPre(){
        this._preValue = this._value
    }

    get changed(){
        const value = this.value.sort()
        const preValue = this.preValue.sort()
        return JSON.stringify(value) !== JSON.stringify(preValue)
    }

    setOptionsValue(){
        if (this.renderRoot) {
            const slot = this.renderRoot.querySelector('slot')
            if (slot) {
                slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION').forEach(option => {
                    option.checked = this.value.includes(option.value)
                })
            }
        }
    }

    removeValue(event){
        event.stopPropagation()
        if (!this.readonly && !this.disabled){
            const value = event.target.getAttribute('value')
            this._value = this._value.filter(item => item != value)
            this.setOptionsValue()
            this.requestUpdate()
        }
    }

    getOptionLabel(value){
        const slot = this.renderRoot.querySelector('slot')
        let label = ""
        if (slot) {
            const options = slot.assignedNodes({flatten: true}).filter(el => el.tagName === 'FX-MULTISELECT-OPTION');
            const option = options.find(option => option.value == value)
            if (option) label = option.innerText
        }
        return label
    }

    //Render
    generateHeader(){
        const placeholder = this.placeholder ?? ''
        let header
        const value = Array.isArray(this.value) ? this.value : []

        this.dispatchChangeEvent()

        if (value.length > this.maxValuesVisible){
            header = html`<span class="option-selected-multiple ${this._disabled ? 'disabled' : ''}">${value.length} selecionados</span>`
        } else {
            if (value.length == 0){
                header = html`<span class="placeholder">${placeholder}</span>`
            } else {
                header = html`
                    ${value.map((option) => 
                        html`<span class="option-selected-multiple ${this._disabled ? 'disabled' : ''}">${this.getOptionLabel(option)}
                            <fx-icon class="remove-option" value="${option}" icon="cancel" 
                            color="var(--fx-secondary-dark)" @click="${this.removeValue}"></fx-icon>
                        </span>`
                    )}
                `
            }
        }
        return header
    }

    render() {
        return html`
            <label for="box" part="label" style="color: ${this.lbcolor};">${this.label}</label>
            <div class="box" part="box" id="box">
                <div part="header" class="select-header"><div class="tags">${this.generateHeader()}</div><fx-icon class="expand-icon" icon="expand_more"></fx-icon></div>
                <div class="options-list">
                    <fx-text-field class="search-box ${ this.search ? '' : 'not-show' }" placeholder="Buscar"></fx-text-field>
                    <fx-checkbox class="select-all ${ this.selectAll ? '' : 'not-show' }" 
                    value="false" ?readonly="${this.readonly}" ?disabled="${this.disabled}">Selecionar tudo</fx-checkbox>
                    <ul class="${this.disabled || this.readonly ? 'disabled' : ''}"><slot></slot></ul>
                </div>
            </div>
            `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);