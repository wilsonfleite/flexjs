import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-list'

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
            position: absolute;
            right: 0.2rem;
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
            height: 1.5rem;
            display: flex;
            align-items: center;
            font-size: 0.9rem;
        }

        .multiple-values {
            box-sizing: border-box;
            border-radius: 0.2rem;
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
            margin-right: 0.2rem;
            padding: 0.2rem 0.8rem;
            height: 100%;
            display: flex;
            align-items: center;
        }

        .remove-value {
            margin-left: 0.3rem;
            cursor: pointer;
        }

        .values-list {
            display: none;
            box-sizing: border-box;
            position: absolute;
            padding: 0.1rem;
            left: 0;
            top: 0;
            width: 100%;
            background-color: var(--fx-background);
            color: var(--fx-background-contrast);
            border: 0.1rem solid var(--fx-secondary);
            border-radius: 0.3rem;
            z-index: 800;
            box-shadow: 0 0 0.3rem var(--fx-secondary);
        }

        .new-value-box {
            margin: 0 0 0.5rem 0;
            display: flex;
            align-items: center;
        }

        .value-inputbox {
            display: block;
            margin: 0 0 0 0;
            width: 100%;
        }

        .value-inputbox::part(box):focus-within {
            box-shadow: none;
            outline: none;
        }

        .value-box {
            display: flex;
            align-items: center;
            width: 100%;
        }

        .value {
            display: block;
            width: 100%;
        }

        .add-button {
            margin: 0 0.2rem 0 0.3rem;
            cursor: pointer;
        }

        .add-button::part(icon) {
            opacity: .7;
        }

        .add-button::part(icon):hover {
            opacity: 1;
        }

        .remove-button {
            margin: 0 0.2rem 0 0.3rem;
            align-self: flex-end;
            cursor: pointer;
        }

        .remove-button::part(icon) {
            opacity: .7;
        }

        .remove-button::part(icon):hover {
            opacity: 1;
        }

        .placeholder {
            color: var(--fx-background-low-contrast);
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        li {
            height: 2rem;
            display: flex;
            align-items: center;
        }

        li:hover {
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
            cursor: pointer;
        }

        .disabled {
            color: var(--fx-background-low-contrast);
        }
    `
    _value = []
    _disabled = false
    _validation = ''
    _preValue = []

    constructor(){
        super()
        this.value = []
        this.preValue = []
        this.type = 'text'
        this.disabled = false
        this.readonly = false
        this.maxValuesVisible = 1
        this.lbcolor = 'var(--fx-background-contrast)'
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        value: {attribute: true, type: Object},
        preValue: {attribute: 'pre-value', type: Object},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        type: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        readonly: {attribute: true, type: Boolean},
        maxValuesVisible: {attribute: 'max-values-visible', type: Number},
        lbcolor: {attribute: true, type: String},
    }

    connectedCallback() {
        super.connectedCallback()
    }

    firstUpdated(){
        this.setHandles()
    }

    set value(val) {
        if (val === undefined || val === null || val === 'undefined') val = []
        let oldVal = this._value
        this._value = val.map(String)
        this.requestUpdate('value', oldVal)
        this.dispatchChangeEvent()
    }
      
    get value() { 
        return toTypeValue(this._value, this.type)
    }

    set preValue(val) {
        if (val === undefined || val === null || val === 'undefined') val = []
        let oldVal = this._preValue
        this._preValue = val.map(String)
        this.requestUpdate('preValue', oldVal)
        this.dispatchChangeEvent()
    }
      
    get preValue() { 
        return toTypeValue(this._preValue, this.type)
    }

    get text() { 
        return toTypeValue(this.value.sort(), 'text')
    }

    get updates() { 
        function diffArrays(arr1, arr2) {
            return arr2.filter(item => !arr1.includes(item));
        }

        return {
            "added": diffArrays(this.preValue, this._value),
            "removed": diffArrays(this._value, this.preValue),
        }
    }

    clear(){
        this.value = []
    }

    reset(){
        this.value = [...this._preValue]
    }

    setPre(){
        this._preValue = [...this._value]
    }

    get changed(){
        const value = [...this.value].sort()
        const preValue = [...this.preValue].sort()
        return JSON.stringify(value) !== JSON.stringify(preValue)
    }

    addValue(val){
        let value = this.value
        value.push(val.toString())
        this.value = value
        this.requestUpdate()
    }

    removeValue(val){
        const values = this.value.filter((value) => {
            return value != val.toString()
        })
        this.value = values
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
    }
      
    get disabled() { 
        return this._disabled
    }

    handleAddValue(event){
        if (!this.disabled && !this.readonly){
            const valueInputBox = this.renderRoot.querySelector('.value-inputbox')
            if (valueInputBox.value != ''){
                this.addValue(valueInputBox.value)
                valueInputBox.value = ""
            }
        }
    }

    handleRemoveValue(event){
        if(!this.disabled && !this.readonly){
            const listValue = event.target.parentNode.querySelector('.val').innerText
            this.removeValue(listValue)
        }
    }

    setHandles(){
        const selectHeader = this.shadowRoot.querySelector('.select-header')
        const expandButton = this.shadowRoot.querySelector('.expand-icon')
        const valueInputBox = this.renderRoot.querySelector('.value-inputbox')

        selectHeader.addEventListener('click', (event) => this.showValuesList())
        expandButton.addEventListener('click', (event) => this.showValuesList())
        valueInputBox.addEventListener('pressEnter', (event) => this.handleAddValue(undefined))
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    showValuesList(){
        const valuesList = this.shadowRoot.querySelector('.values-list')
        valuesList.style.display = 'block'
        console.log(this)
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    hideValuesList(){
        const valuesList = this.shadowRoot.querySelector('.values-list')
        valuesList.style.display = 'none'
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.hideValuesList()
        }
    }

    generateHeader(){
        const placeholder = this.placeholder ?? ''
        let header

        if (this.value.length > this.maxValuesVisible){
            header = html`<span class="multiple-values">${this.value.length} valores</span>`
        } else {
            if (this.value.length == 0){
                header = html`<span class="placeholder">${placeholder}</span>`
            } else {
                header = html`
                    ${this.value.map((value) => 
                        html`<span class="multiple-values"><span class="val">${value}</span>
                            <material-icon class="remove-value" icon="cancel" @click="${this.handleRemoveValue}"></material-icon>
                        </span>`
                    )}
                `
            }
        }

        return header
    }

    render() {
        return html`
            <label for="fx-text-field" part="label" style="color: ${this.lbcolor};">${this.label}</label>
            <div class="box" part="box">
                <div part="header" class="select-header ${this.disabled ? 'disabled' : ''}">${this.generateHeader()}</div>
                <fx-icon class="expand-icon" icon="expand_more"></fx-icon>
                <div class="values-list">
                    <span class="new-value-box">
                        <fx-text-field class="value-inputbox" placeholder="Novo valor"></fx-text-field>    
                        <fx-icon icon="add_circle" class="add-button" 
                        color='var(--fx-primary)' size='1.3rem' @click="${this.handleAddValue}"></fx-icon>
                    </span>
                    <ul class="${this.disabled ? 'disabled' : ''}">
                    ${this.value.map((value) => 
                        html`<li class="item" @click="${this.disabled ? undefined: this._selectValue }">
                            <span class="value-box">
                                <span class="value val">${value}</span>
                                <fx-icon icon="remove_circle" class="remove-button" 
                                color='var(--fx-secondary)' size='1.3rem' @click="${this.handleRemoveValue}"></fx-icon>
                            </span>
                        </li>`
                    )}
                    </ul>
                </div>
            </div>
            `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);