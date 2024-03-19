import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-kanban-card'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            display: block;
            box-sizing: border-box;
            background-color: var(--fx-background-hard);
            border: 0.1rem solid var(--fx-background-low-contrast);
            border-radius: 0.2rem;
        }

        ::slotted([slot="tags"]) {
            display: flex;
            flex-direction: row; 
            flex-wrap: wrap;
            gap: 0.2rem; 
        }

        .card {
            width: 100%;
            min-height: 3rem;
            box-sizing: border-box;
            padding: 0.4rem;
        }

        .header {
            display: flex;
            width: 100%;
        }

        .tags {
            width: 100%;
        }

        .content {
            font-size: 0.9rem;
        }
    `

    constructor(){
        super()
        this.tags = []
        this.description = {}
        this.actions = []
        this.metadata = {}
    }

    static properties = {
        tags: {attribute: true, type: Object},
        description: {attribute: true, type: Object},
        status: {attribute: true, type: String},
        actions: {attribute: true, type: Object},
        metadata: {attribute: true, type: Object},
    }

    //Properties

    //Methods

    //Render
    render() {
        return html`
        <div class="card">
            <div class="header">
                <div class="tags"><slot name="tags"></slot></div>
                <div class="button">
                    <fx-context-menu></fx-context-menu>
                </div>
            </div>
            <div class="content"><slot></slot></div>
        </div>
        `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);