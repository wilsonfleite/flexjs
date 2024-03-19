import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-catalog-button'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            color: var(--fx-secondary-contrast);
            background-color: var(--fx-secondary);
            border-radius: 0.3rem;
        }

        .button {
            display: flex;
            width: 7rem;
            height: 6rem;
            background-color: transparent;
            flex-direction: column;
            cursor: pointer;
        }

        .button:hover {
            background-color: rgba(128,128,128,.4)
        }

        .icon {
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .text {
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: .9rem;
            font-weight: 500;
            color: var(--fx-secondary-contrast);
        }

        a {
            text-decoration: none;
        }
    `

    constructor(){
        super()
    }

    static properties = {
        text: {attribute: true, type: String},
        icon: {attribute: true, type: String},
        href: {attribute: true, type: String},
        event: {attribute: true, type: String},
        args: {attribute: true, type: String},
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
        const href = this.href ?? '#'
        return html`
        <a href="${href}">
            <div class="button" @click="${this.dispatchCustomEvent}">
                <div class="icon">
                    <fx-icon icon="${this.icon}" color='var(--fx-secondary-contrast)' size="2rem"></fx-icon>
                </div>
                <div class="text">
                    ${this.text}
                </div>
            </div>
        </a>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);