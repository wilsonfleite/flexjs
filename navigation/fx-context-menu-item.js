import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-context-menu-item'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .menu-item {
            min-width: 8rem;
            background-color: var(--fx-background);
            color: var(--fx-background-contrast);
            white-space: nowrap;
            padding: 0.3rem;
        }

        .menu-item:hover {
            background-color: color-mix(in srgb, var(--fx-secondary), transparent 70%);
        }
    `
    static properties = {
        event: {attribute: true, type: String},
        args: {attribute: true, type: String},
        disabledClosing: {attribute: 'disabled-closing', type: Boolean},
    }

    dispatchEvents(event, args){
        if (!this.disabledClosing){
            const contextMenuItemClickedEvent = new CustomEvent('contextMenuItemClicked', {
                bubbles: true,
                composed: true
            })
            this.dispatchEvent(contextMenuItemClickedEvent)
        }

        if (event != '') {
            const customEvent = new CustomEvent(event, {
                detail: {
                    args: args , 
                    origin: this
                }, 
                bubbles: true,
                composed: true
            })
            this.dispatchEvent(customEvent)
        }
    }

    render() {
        return html`<div class="menu-item" @click="${()=>this.dispatchEvents(this.event, this.args)}"><slot></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);