import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-button'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            width: var(--width);
            display: block;
        }

        .button {
            padding: 0.3rem 0.5rem;
            border-radius: 0.4rem;
            font-size: 1rem;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.8rem;
        }

        .button:hover {
            opacity: .8;
        }

        .mask {
            width: 100%;
            border-radius: 0.4rem;
            background-color: var(--fx-background-contrast);
        }

        .mask:hover {
            visibility: visible;
        }
    `
    
    constructor(){
        super()
        this.icon = ''
        this.event = ''
        this.args = {}
        this.color = 'var(--fx-primary-contrast)'
        this.backcolor = 'var(--fx-primary)'
        this.width = 'fit-content'
        this.style.setProperty('--width', 'fit-content')
    }

    static properties = {
        icon: {attribute: true, type: String},
        event: {attribute: true, type: String},
        args: {attribute: true, type: String},
        color: {attribute: true, type: String},
        backcolor: {attribute: true, type: String},
        width: {attribute: true, type: String},
    }

    update(changedProperties) {
        super.update()
        if (changedProperties.has('width')) {
            const width = this.width ? this.width : 'fit-content'
            this.style.setProperty('--width', width)
        }
    }

    dispatchCustomEvent(){
        const event = this.event ?? undefined
        if (event) {
            const customEvent = new CustomEvent(event, {
                bubbles: true,
                composed: true,
                detail: {
                    args: this.args,
                    origin: this
                }
            })
            this.dispatchEvent(customEvent)
        }
    }

    render() {
        return html`
        <div class="mask">
            <div class="button" style="background-color: ${this.backcolor}; color:${this.color};" @click="${this.dispatchCustomEvent}" part="button">
                ${ this.icon !== '' ? html`<fx-icon icon="${this.icon}" size='1.5rem' color='${this.color}'></fx-icon>` : html`` }
                ${this.hasChildNodes() ? html`<span class="text"><slot></slot></span>` : html``}
            </div>
        </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);