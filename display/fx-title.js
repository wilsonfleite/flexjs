import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-title'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            display: block;
            width: 100%;
            font-size: 1.2rem;
            border-bottom: 1px solid var(--fx-secondary);
            padding: 0.4rem 0;
			margin: 1rem 0;
        }
    `
    render() {
        return html`<slot></slot>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);