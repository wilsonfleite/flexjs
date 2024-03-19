import { LitElement, html, css } from "../refs/lit.js";
const TAG_NAME = "fx-table";

import {generateUUID} from '../fx-core.js'

class CustomWebComponent extends LitElement {
    static styles = css`
        :host {
            display: inline-grid;
            grid-template-columns: var(--grid-columns);
            box-sizing: border-box;
            background-color: var(--fx-background);
        }
    `;

    constructor(){
        super()
        this.style.setProperty('--grid-columns', 'auto')
    }

    firstUpdated(){
        const columns = Array.from(this.querySelectorAll(':scope > fx-table-head-row > fx-table-head-select, :scope > fx-table-head-row > fx-table-head-cell, :scope > fx-table-head-row > fx-table-head-expand'))
        this.style.setProperty('--grid-columns', `repeat(${columns.length}, auto)`)
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("selectAll", this.selectAll);
        this.addEventListener("removeItem", this.removeItem);
        this.addEventListener("cancelItem", this.cancelItem);
        this.addEventListener("removeCheckedItems", this.removeCheckedItems);
        this.addEventListener("cancelCheckedItems", this.cancelCheckedItems);
        this.addEventListener("duplicateItem", this.duplicateItem);
        this.addEventListener("addItem", this.addItemEventHandler);
        this.addEventListener("sortTable", this.sortTable);
        this.addEventListener("filteredItems", this.filteredItems);
        this.addEventListener("mouseOverCell", this.mouseOverCell);
        this.addEventListener("mouseOutCell", this.mouseOutCell);
        this.addEventListener("expandAppendAll", this.expandAppendAll);
    }

    addItemEventHandler(event){
        event.stopPropagation();
        this.addItem()
    }

    mouseOverCell(event){
        const row = event.target.closest('fx-table-row')
        const cells = row.querySelectorAll('fx-table-cell, fx-table-cell-select, fx-table-cell-expand')
        cells.forEach(cell => cell.style.backgroundImage = "linear-gradient(to right, rgba(128,128,128,.4), rgba(128,128,128,.4))")
    }
    
    mouseOutCell(event){
        const row = event.target.closest('fx-table-row')
        const cells = row.querySelectorAll('fx-table-cell, fx-table-cell-select, fx-table-cell-expand')
        cells.forEach(cell => cell.style.backgroundImage = "none")
    }

    selectAll(event) {
        event.stopPropagation()
        const selected = event.detail.selected;
        const selectCells = this.querySelectorAll(":scope > fx-table-row > fx-table-cell-select");
        selectCells.forEach((item) => (item.value = selected));
    }

    removeItem(event) {
        const row = event.target.closest("fx-table-row");
        row.status = "removed";
    }

    cancelItem(event) {
        const row = event.target.closest("fx-table-row");
        row.status = "canceled";
    }

    removeCheckedItems(event) {
        event.stopPropagation();
        const selectCells = this.querySelectorAll(":scope > fx-table-row > fx-table-cell-select");
        selectCells.forEach((select) => {
            if (select.value) {
                const row = select.closest("fx-table-row");
                row.status = "removed";
            }
        });
    }

    cancelCheckedItems(event) {
        event.stopPropagation();
        const selectCells = this.querySelectorAll(":scope > fx-table-row > fx-table-cell-select");
        selectCells.forEach((select) => {
            if (select.value) {
                const row = select.closest("fx-table-row");
                if (row.status != "removed") row.status = "canceled";
            }
        });
    }

    duplicateItem(event) {
        event.stopPropagation();
        const row = event.target.closest("fx-table-row");
        const clone = row.cloneNode(true);
        clone.status = "added";
        this.appendChild(clone);
    }

    addItem(itemData = {}) {
        const modelSlot = this.querySelector("*[slot=model]");
        const modelRow = modelSlot.querySelector("fx-table-row");
        const clone = modelRow.cloneNode(true);
        clone.status = itemData.status ?? "added";
        clone.setAttribute('status', clone.status)
        clone.metadata = itemData.metadata ?? {};
        clone.rowid = itemData.rowid ?? generateUUID();
        clone.setAttribute('rowid', clone.rowid)
        const data = itemData.data ?? {};
        Object.keys(data).forEach(key => {
            const cell = clone.querySelector(`fx-table-cell[name='${key}']`)
            cell.value = data[key]
        })
        this.appendChild(clone);
    }

    sortTable(event) {
        event.stopPropagation();
        const args = JSON.parse(event.detail.args)
        const name = args.name;
        const direction = args.direction;

        let rows, switching, i, x, y, shouldSwitch;
        switching = true;

        while (switching) {
            switching = false;
            rows = this.querySelectorAll(`:scope > fx-table-row:has(fx-table-cell[name='${name}'])`);
            for (i = 0; i < rows.length - 1; i++) {
                let xText, yText;
                shouldSwitch = false;
                x = rows[i].querySelector(`fx-table-cell[name='${name}']`);
                y = rows[i + 1].querySelector(`fx-table-cell[name='${name}']`);
                xText = x.text
                yText = y.text
                if (direction == 'asc'){
                    xText = (Array.isArray(xText) ? xText.sort().join(',') : xText).toLowerCase()
                    yText = (Array.isArray(yText) ? yText.sort().join(',') : yText).toLowerCase()
                    if (xText > yText) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    xText = (Array.isArray(xText) ? xText.sort().reverse().join(',') : xText).toLowerCase()
                    yText = (Array.isArray(yText) ? yText.sort().reverse().join(',') : yText).toLowerCase()
                    if (xText < yText) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
        this.sortAppendRows()
    }

    insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    sortAppendRows(){
        const rows = this.querySelectorAll(":scope > fx-table-row");
        rows.forEach(row => {
            const appends = Array.from(this.querySelectorAll(`:scope > fx-table-row-append[rowid='${row.rowid}']`)).reverse();
            appends.forEach(append => {
                this.insertAfter(append, row);
            })
        })
    }

    filteredItems(event){
        event.stopPropagation();
        const name = event.detail.name
        const items = event.detail.items.map(item => item.replace('(Em branco)', ''))
        const cells = this.querySelectorAll(`:scope > fx-table-row > fx-table-cell[name='${name}']`)
        cells.forEach(cell => {
            if (Array.isArray(cell.text)){
                cell.hidden = !cell.text.every(el => items.includes(el));
            } else {
                cell.hidden = !items.includes(cell.text);
            }
        })
        const rows = this.querySelectorAll(":scope > fx-table-row")
        rows.forEach(row => {
            const hidden = Array.from(row.querySelectorAll('fx-table-cell')).some(cell => cell.hidden)
            row.hidden = hidden
            const appendRows = this.querySelectorAll(`:scope > fx-table-row-append[rowid='${row.rowid}']`)
            appendRows.forEach(appendRow => {
                appendRow.hidden = hidden
            })
        })
    }

    get data(){
        const rows = Array.from(this.querySelectorAll(':scope > fx-table-row'))
        let tableData = rows.map(row => row.data)
        return tableData
    }

    set data(tableData){
        tableData.forEach(rowData => {
            const row = this.querySelector(`:scope > fx-table-row[rowid='${rowData.rowid}']`)
            let newData = {}
            if ('data' in rowData) newData['data'] = rowData.data
            if ('status' in rowData) newData['status'] = rowData.status
            if ('metadata' in rowData) newData['metadata'] = rowData.metadata
            if (row){
                row.data = newData
            } else {
                if ('rowid' in rowData) newData['rowid'] = rowData.rowid
                this.addItem(newData)
            }
        })
    }

    showRowAppend(rowid, append){
        const rowAppend = this.querySelector(`:scope > fx-table-row-append[append='${append}'][rowid='${rowid}']`)
        if (rowAppend) rowAppend.visible = true
    }

    hideRowAppend(rowid, append){
        const rowAppend = this.querySelector(`:scope > fx-table-row-append[append='${append}'][rowid='${rowid}']`)
        if (rowAppend) rowAppend.visible = false
    }

    expandAppendAll(event) {
        event.stopPropagation();
        const visible = event.detail.visible;
        const append = event.detail.append;
        const rows = this.querySelectorAll(`:scope > fx-table-row`);
        rows.forEach(row => {
            const expand = row.querySelector(`:scope > fx-table-cell-expand[append='${append}']`)
            if (expand) expand.value = visible
        })
    }

    render() {
        return html`<slot></slot>`;
    }

}

customElements.define(TAG_NAME, CustomWebComponent);
