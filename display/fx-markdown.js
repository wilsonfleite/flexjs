import { LitElement, html, css, unsafeHTML } from '../refs/lit.js';
import marked from '../refs/marked.js';
const TAG_NAME = 'fx-markdown'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            width: 100%;
            border: none;
            min-height: 1.8rem;
            padding: 0;
            box-sizing: border-box;
            overflow: visible;
        }

        textarea {
            width: 100%;
            height: 180px;
            border: 1px solid lightblue;
            box-sizing: border-box;
            display: var(--textarea-display, none);
        }
    `
    constructor(){
        super()
        this.value = ''
        this.editmode = 'none'
    }

    static properties = {
        value: {attribute: true, type: String},
        editmode: {attribute: true, converter: 
            {
                fromAttribute: (value, type) => {
                    return value !== null ? 'block' : 'none'
                },
            }
        },
    }

    updated() {
        this.style.setProperty('--textarea-display', this.editmode);
    }

    _dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    updateValue(event) {
        const textarea = event.target
        this.value = textarea.value
        this._dispatchChangeEvent()
    }

    render() {
        return html`
            <label for="text-input" part="label">${this.label}</label>
            <textarea @input=${this.updateValue}>${this.value}</textarea>
            <div class="box">
                ${ unsafeHTML(marked.parse(this.value, {mangle: false, headerIds: false})) }
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);