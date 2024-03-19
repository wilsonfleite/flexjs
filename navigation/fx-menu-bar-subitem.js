import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-menu-bar-subitem'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        .subitem {
            height: 2rem;
            width: 100%;
            padding: 0 0.8rem;
            white-space: nowrap;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            color: var(--fx-background-contrast);
            gap: 0.4rem;
        }
        .subitem:hover {
            background-color: rgba(128, 128, 128, .4);
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
        const icon = this.icon ? html`<fx-icon icon="${this.icon}" size="1.6rem" color="var(--fx-background-contrast)"></fx-icon>` : html``
        const href = this.href ?? ''

        return html`<a href="${href}">
                <div class="subitem" @click="${() => this.dispatchCustomEvent(this.event, this.args)}">${icon}${this.text}</div>
            </a>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)