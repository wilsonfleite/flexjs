import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = "fx-table-row";

import {generateUUID} from '../fx-core.js'

class CustomWebComponent extends LitElement {     
    static styles = css`
        :host {
            display: var(--display);
        }
    `;

    background = 'transparent'

    constructor(){
        super()
        this.rowid = generateUUID()
        this.metadata = {}
        this.status = ''
        this.style.setProperty('--display', 'contents')
    }

    static properties = {
        status: {attribute: true, type: String},
        hidden: {attribute: true, type: Boolean},
        metadata: {attribute: true, type: Object},
        rowid: {attribute: true, type: String, reflect: true},
    }

    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('rowSelection', this.rowSelection)
    }

    shouldUpdate(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('status')){
            switch(this.status){
                case 'added':
                    this.background = 'var(--fx-added)'
                    this.style.setProperty('--display', 'contents')
                    break
                case 'canceled':
                    this.background = 'var(--fx-removed)'
                    this.style.setProperty('--display', 'contents')
                    break
                case 'removed':
                    this.background = 'var(--fx-removed)'
                    this.style.setProperty('--display', 'none')
                    break
                default:
                    this.background = 'transparent'
                    this.style.setProperty('--display', 'contents')
                    break
            }
            const cells = this.querySelectorAll('fx-table-cell, fx-table-cell-select, fx-table-cell-expand')
            cells.forEach(cell => cell.style.backgroundColor = this.background)
        }
        if (changedProperties.has('hidden')){
            if (this.hidden){
                this.style.setProperty('--display', 'none')
            } else {
                if (this.status != 'removed'){
                    this.style.setProperty('--display', 'contents')
                }
            }
        }
    }

    rowSelection(event){
        if (event.detail.selected){
            const cells = this.querySelectorAll('fx-table-cell, fx-table-cell-select, fx-table-cell-expand')
            cells.forEach(cell => cell.style.boxShadow = "inset 0 0 0 100rem rgba(128,128,128,.3)")
        } else {
            const cells = this.querySelectorAll('fx-table-cell, fx-table-cell-select, fx-table-cell-expand')
            cells.forEach(cell => cell.style.boxShadow = "none")
        }
    }

    get data(){
        let status = this.status ?? ''
        const cells = this.querySelectorAll('fx-table-row > fx-table-cell')
        let rowData = {}
        cells.forEach(cell => {
            if (cell.getAttribute('name')){
                rowData[cell.getAttribute('name')] = cell.value
                if (cell.changed && status == '') status = 'updated'
            }
        })

        return {
            'data': rowData,
            'metadata': this.metadata ?? {},
            'status': status,
            'rowid': this.rowid
        }
    }

    set data(rowData){
        const values = rowData.data ?? {}
        Object.keys(values).forEach(key => {
            const cell = this.querySelector(`fx-table-cell[name='${key}']`)
            cell.value = values[key]
        })
        if ('metadata' in rowData) this.metadata = rowData.metadata
        if ('status' in rowData) this.status = rowData.status
        if ('rowid' in rowData) this.rowid = rowData.rowid
    }

    render() {
        return html`<slot></slot>`;
    }

}

customElements.define(TAG_NAME, CustomWebComponent);
