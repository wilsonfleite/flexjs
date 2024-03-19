import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-side-menu-subitem'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        .subitem-menu-container {
            overflow: hidden;
            box-sizing: content-box;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            color: var(--fx-primary-dark-contrast);
            white-space: nowrap;
            padding: 0.4rem;
            cursor: pointer;
            margin: 0 0.1rem 0 2rem;
            border-radius: 0.3rem;
        }
        .subitem-menu-container:hover {
            background-color: rgba(128,128,128,.4)
        }
        .text {
            margin-left: 0.5rem;
            width: 100%;
        }
        a {
            text-decoration: none;
        }
    `

    constructor(){
        super()
        this.icon = null
        this.text = ''
        this.href = '#'
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
        const icon = this.icon ? html`<fx-icon icon="${this.icon}" size="1.6rem" color="var(--fx-primary-dark-contrast)"></fx-icon>` : html``
        const href = this.href ?? '#'

        return html`<a href="${href}"><div class="subitem-menu-container" @click="${() => this.dispatchCustomEvent(this.event, this.args)}">
                ${icon}<div class="text">${this.text}</div>
            </div></a>`

    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)