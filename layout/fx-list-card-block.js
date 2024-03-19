import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-list-card-block'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            overflow: hidden;
            flex: var(--flex);
        }

        .header {
            flex: 0 1 auto;
            background-color: var(--fx-background-low-contrast);
            font-size: 0.9rem;
            color: var(--fx-background);
            padding: 0.1rem 0.2rem;
        }

        .content {
            flex: 1 1 auto;
            font-size: 0.9rem;
            background-color: var(--fx-background);
            padding: 0.1rem 0.2rem;
        }
    `

    constructor(){
        super()
        this.style.setProperty('--flex', '0 1 auto');
    }

    static properties = {
        title: {attribute: true, type: String},
        stretch: {attribute: true, type: Boolean},
        width: {attribute: true, type: String},
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('stretch')){
            if (this.stretch){
                this.style.setProperty('--flex', '1 1 auto')
            } else {
                this.style.setProperty('--flex', '0 1 auto')
            }
        }
    }

    render() {
        const header = this.title ? html`<div class="header">${this.title}</div>` : html``
        return html`${header}<div class="content" part="content"><slot></slot></div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);