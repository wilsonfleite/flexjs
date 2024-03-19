import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-menu-bar-item'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            height: 100%;
            width: fit-content;
            display: block;
        }
        .button {
            height: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 0.4rem;
            color: var(--fx-primary-contrast);
        }
        .container-button {
            height: 100%;
            padding: 0 0.8rem;
            font-size: 1rem;
            display: flex;
            cursor: pointer;
            position: relative;
        }
        .container-button:hover {
            background-color: rgba(0, 0, 0, .3)
        }
        .subitems {
            display: none;
            top: 3.2rem;
            padding: 0;
            position: absolute;
            background-color: var(--fx-background-hard);
            box-sizing: border-box;
            border: 0.1rem solid var(--fx-background-contrast);
            border-top: none;
            min-width: 100%;
            z-index: 8888;
        }
        .container-button:hover .subitems {
            display: block;
        }
        a {
            text-decoration: none;
        }
    `

    constructor(){
        super()
        this.icon = null
        this.text = ''
        this.href = null
        this.event = null
        this.args = null
    } 

    static properties = {
        'icon': {attribute: true, type: String},
        'text': {attribute: true, type: String},
        'href': {attribute: true, type: String},
        'event': {attribute: true, type: String},
        'args': {attribute: true, type: String}
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

    //Render
    render() {

        const icon = this.icon ? html`<fx-icon icon="${this.icon}" size="1.6rem" color="var(--fx-primary-contrast);"></fx-icon>` : html``

        const parentSlot = this.assignedSlot.name
        const submenusAlign = parentSlot == 'start' ? 'left: 0;' : 'right: 0;'

        const href = this.href ?? '#'

        const button = html`<a href="${href}">
                <div class="button" @click="${() => this.dispatchCustomEvent(this.event, this.args)}">${icon}${this.text}</div>
            </a>`

        return html`<div class="container-button">${button}
                        <div class="subitems" style="${submenusAlign}">
                            <slot></slot>
                        </div>
                    </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)