import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-file-picker'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            width: 100%;
            border: 0.1rem solid var(--fx-secondary);
            border-radius: 0.4rem;
            height: 1.8rem;
            padding: 0 0.4rem 0 0;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 40%);
            gap: 0.2rem;
        }

        .box:focus-within {
            outline: 0.1rem solid var(--fx-secondary-dark);
            box-shadow: 0 0 0.2rem var(--fx-secondary-dark);
        }

        .fake-input {
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

        .input-file {
            display: none;
        }
    `

    _value = ''

    constructor(){
        super()
        this.value = ''
        this.label = ''
        this.accept = ''
    }

    static properties = {
        value: {attribute: true, type: Object},
        placeholder: {attribute: true, type: String},
        label: {attribute: true, type: String},
        accept: {attribute: true, type: String},
        multiple: {attribute: true, type: Boolean},
    }

    get files() { 
        return this.shadowRoot.querySelector('input').files
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    fileInputClick(){
        this.renderRoot.querySelector('.input-file').click()
    }

    updateValue(){
        const inputFile = this.renderRoot.querySelector('.input-file')
        const fakeInput = this.renderRoot.querySelector('.fake-input')
        if (inputFile.files.length == 1) {
            fakeInput.value = inputFile.files[0].name
        } else if (inputFile.files.length > 1) {
            fakeInput.value = `${inputFile.files.length} arquivos`
        } else {
            fakeInput.value = ''
        }
        this.value = inputFile.files
    }

    render() {
        return html`
            <label for="input" part="label">${this.label}</label>
            <div class="box" part="box">
                <fx-button @click="${this.fileInputClick}">Selecionar</fx-button>
                <input type="text" class="fake-input" id="input" class="fake-input" 
                placeholder="${this.placeholder}" @click="${this.fileInputClick}">
                <input type="file" class="input-file" accept="${this.accept}" 
                ?multiple=${this.multiple} @change="${this.updateValue}">
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);