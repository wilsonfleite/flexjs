import { LitElement, html, css, live } from '../refs/lit.js';
const TAG_NAME = "fx-table-head-cell";

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: flex;
            background-color: var(--fx-secondary);
            padding: 0 0.3rem;
            height: 3rem;
            box-sizing: border-box;
            color: var(--fx-secondary-contrast);
            border-bottom: 0.1rem solid var(--fx-background-low-contrast);
        }

        :host(:nth-child(even)) {
            box-shadow: inset 0 0 0 100rem rgba(128,128,128,.1);
        }

        .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
    `;

    constructor(){
        super()
        this.items = null
    }

    static properties = {
        filters: {attribute: true, type: Boolean},
        items: {attribute: true, type: Object},
    }

    updateFilters(event){
        const composedPath = event.composedPath()
        if (composedPath.some(el => el.tagName === 'FX-MULTISELECT')){
            const filteredItems = this.renderRoot.querySelector('#filter').value
            const customEvent = new CustomEvent('filteredItems', {bubbles: true, 
                composed: true, detail: {'name': this.getAttribute('name'), 'items': filteredItems}})
            this.dispatchEvent(customEvent)

        } else if (!composedPath.some(el => el.tagName === 'FX-CONTEXT-MENU-ITEM')){
            const table = this.closest('fx-table')
            const rows = Array.from(table.querySelectorAll('fx-table > fx-table-row')).filter(row => row.status != 'removed')
            let cells = []
            rows.forEach(row => {
                const tableCell = row.querySelector(`fx-table-cell[name='${this.getAttribute('name')}']`)
                if (tableCell) cells.push(tableCell)
            })
            let items = []
            cells.forEach(item => {
                if (item.text == ''){
                    items.push('(Em branco)')
                } else if (Array.isArray(item.text)) {
                    item.text.forEach(i => i == '' ? '(Em branco)' : items.push(i))
                } else {
                    items.push(item.text)
                }
            })
            const uniqueItems = [...new Set(items)]; 
            this.items = uniqueItems.sort()
        }
    }

    render() {
        const items = Array.isArray(this.items) ? this.items : []
        return html`<div class="header">
            <slot></slot>
            ${
                this.filters ? html`<fx-context-menu icon="more_vert" color="var(--fx-secondary-contrast)" @click="${this.updateFilters}">
                    <fx-context-menu-item event="sortTable" args='{"name": "${this.getAttribute('name')}", "direction": "asc"}'>Crescente</fx-context-menu-item>
                    <fx-context-menu-item event="sortTable" args='{"name": "${this.getAttribute('name')}", "direction": "desc"}'>Decrescente</fx-context-menu-item>
                    <fx-context-menu-item event="" args="" disabled-closing>
                        <fx-multiselect type="text" search select-all max-values-visible="1" id="filter" value='${JSON.stringify(items)}'>
                            ${items.map((item) => 
                                html`<fx-multiselect-option value="${item}" checked="${items.includes(item)}">${item}</fx-multiselect-option>`
                            )}
                        </fx-multiselect>
                    </fx-context-menu-item>
                </fx-context-menu>` : html``
            }
        </div>`;
    }
}

customElements.define(TAG_NAME, CustomWebComponent);
