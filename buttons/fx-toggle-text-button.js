import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-toggle-text-button'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            width: 100%;
            border: none;
            height: 1.8rem;
            padding: 0;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            gap: 0.2rem;
            cursor: pointer;
        }

        .text {
            display: flex;
            align-items: center;
        }
    `

    _value = false

    constructor(){
        super()
        this.textFalse = 'Expand'
        this.textTrue = 'Collapse'
        this.iconFalse = 'expand_more'
        this.iconTrue = 'expand_less'
        this.color = 'var(--fx-background-contrast)'
    }

    static properties = {
        value: {attribute: true, converter: 
            {
                fromAttribute: (value, type) => {
                    return JSON.parse(value)
                },
                toAttribute: (value, type) => {
                    return value
                },
            }
        },
        textTrue: {attribute: 'text-true', type: String},
        textFalse: {attribute: 'text-false', type: String},
        iconTrue: {attribute: 'icon-true', type: String},
        iconFalse: {attribute: 'icon-false', type: String},
        color: {attribute: true, type: String},
        event: {attribute: true, type: String},
        args: {attribute: true, type: String},
    }
     
    set value(val) {
        let oldVal = this._value;
        this._value = val;
        this.requestUpdate('value', oldVal);
        this.dispatchChangeEvent()
    }
      
    get value() { 
        return this._value;
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    toggleContent(event) {
        this.value = !this.value
        this.dispatchCustomEvent()
    }

    dispatchCustomEvent(){
        const event = this.event ?? undefined
        if (event) {
            const customEvent = new CustomEvent(event, {
                bubbles: true,
                composed: true,
                detail: {
                    args: this.args,
                    value: this.value,
                    origin: this
                }
            })
            this.dispatchEvent(customEvent)
        }
    }

    render() {
        const text = this.value ? this.textTrue : this.textFalse
        const icon = this.value ? this.iconTrue : this.iconFalse

        return html`
        <div class="box" @click="${this.toggleContent}">
            <span><fx-icon icon="${icon}" color="${this.color}"></fx-icon></span>
            <span class="text" style="color: ${this.color};">${text}</span>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);