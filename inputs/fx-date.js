import { LitElement, html, css, map, range, live, repeat } from '../refs/lit.js';
const TAG_NAME = 'fx-date'

import { DateTime } from '../refs/luxon.js';

import {DocumentClickEmitter} from '../fx-core.js'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
        }

        .box {
            position: relative;
            width: 100%;
            border: none;
            min-height: 1.8rem;
            padding: 0;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            overflow: visible;
        }

        label {
            font-weight: 500;
            font-size: 0.8rem;
        }

        .input-box {
            position: relative;
            width: 100%;
            border: 0.1rem solid var(--fx-secondary);
            border-radius: 0.3rem;
            height: 1.8rem;
            padding: 0 0.4rem;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            background-color: color-mix(in srgb, var(--fx-background-hard), transparent 40%);
        }

        .input-box:focus-within {
            outline: 0.1rem solid var(--fx-secondary-dark);
            box-shadow: 0 0 0.2rem var(--fx-secondary-dark);
        }

        input {
            outline: none;
            border: none;
            height: 1.5rem;
            width: 100%;
            font-size: 1rem;
            box-sizing: border-box;
            background-color: transparent;
        }

        .value-view-box {
            display: block;
        }

        .value-input-box {
            display: none;
        }

        .calendar-box {
            position: absolute;
            display: none;
            flex-direction: column;
            width: 15rem;
            top: 2.1rem;
            border: 0.1rem solid var(--fx-secondary);
            background-color: var(--fx-background);
            color: var(--fx-background-contrast);
            padding: 0.2rem;
            border-radius: 0.2rem;
            z-index: 15000;
        }

        .date-selection {
            display: flex;
            flex-direction: row;
            margin-bottom: 0.2rem;
        }

        .month-selector {
            width: 60%;
        }

        .year-selector {
            width: 40%;
        }

        .week-title {
            padding: 0.1rem;
            width: 12.5%;
            font-size: 0.9rem;
            display: table-cell;
            text-align: center;
            background-color: var(--fx-secondary-dark);
            color: var(--fx-secondary-dark-contrast);
            font-weight: 500;
            cursor: default;
        }

        .day-title {
            padding: 0.1rem;
            width: 12.5%;
            display: table-cell;
            text-align: center;
            background-color: var(--fx-secondary);
            color: var(--fx-secondary-contrast);
            font-weight: 500;
            cursor: default;
        }

        .calendar-dates {
            padding: 0.1rem;
            display: table;
        }

        .week {
            display: table-row;
        }

        .day {
            padding: 0 0.1rem;
            width: 12.5%;
            display: table-cell;
            text-align: center;
            cursor: pointer;
            box-sizing: border-box;
            border: 0.15rem solid var(--fx-background);
        }

        .week-of-year {
            padding: 0.1rem;
            width: 12.5%;
            display: table-cell;
            text-align: center;
            background-color: var(--fx-secondary-light);
            color: var(--fx-secondary-light-contrast);
            font-weight: 400;
            cursor: default;
        }

        .today {
            font-weight: 800;
            border: 0.15rem solid var(--fx-warning);
        }

        .saturday {
            color: var(--fx-background-low-contrast);
        }

        .sunday {
            color: var(--fx-danger);
        }

        .out-of-month {
            color: var(--fx-background-soft);
        }

        .selected-date {
            background-color: var(--fx-secondary-dark);
            color: var(--fx-secondary-dark-contrast);
        }

        .clear-icon {
            position: absolute;
            right: 0.3rem;
            cursor: pointer;
        }

        .clear-icon:hover {
            opacity: .8;
        }

        .disabled {
            color: var(--fx-background-low-contrast);
        }
    `

    _disabled = false
    _preValue = ''

    constructor(){
        super()
        this.disabled = false
        this.value = null
        this.preValue = null
        this.lbcolor = 'var(--fx-background-contrast)'
        this.documentClickEmitter = new DocumentClickEmitter()
    }

    static properties = {
        value: {attribute: true, type: String},
        preValue: {attribute: 'pre-value', type: String},
        label: {attribute: true, type: String},
        disabled: {attribute: true, type: Boolean},
        readonly: {attribute: true, type: Boolean},
        baseDate: {attribute: true, type: Object},
        lbcolor: {attribute: true, type: String},
    }

    get text(){
        return this.value ? DateTime.fromISO( this.value ).toFormat('dd/MM/yyyy') : ''
    }

    connectedCallback() {
        super.connectedCallback()
        this.renderRoot.addEventListener('change', this.handleChangeEvents.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.renderRoot.removeEventListener('change', this.handleChangeEvents.bind(this))
    }


    hideCalendarEventHandler(event){
        if (!event.composedPath().includes(this)) this.hideCalendar()
    }

    hideCalendar(){
        const calendarBox = this.renderRoot.querySelector('.calendar-box')

        if (calendarBox.style.display != 'flex') return
        calendarBox.style.display = 'none'

        const viewBox = this.renderRoot.querySelector('.value-view-box')
        const inputBox = this.renderRoot.querySelector('.value-input-box')

        const selectedData = DateTime.fromFormat(inputBox.value, 'dd/MM/yyyy').toFormat('yyyy-MM-dd')
        this.value = selectedData
        this.dispatchChangeEvent()

        viewBox.value = DateTime.fromISO( this.value ).toFormat('dd/MM/yyyy')

        viewBox.style.display = 'block'
        inputBox.style.display = 'none'
        this.documentClickEmitter.unsubscribe(this, 'documentClickHandler')
    }

    showCalendar(){
        this.renderRoot.querySelector('.calendar-box').style.display = 'flex'
        const viewBox = this.renderRoot.querySelector('.value-view-box')
        const inputBox = this.renderRoot.querySelector('.value-input-box')

        inputBox.value = viewBox.value

        viewBox.style.display = 'none'
        inputBox.style.display = 'block'

        inputBox.focus()
        this.documentClickEmitter.subscribe(this, 'documentClickHandler')
    }

    documentClickHandler(event){
        if (!event.composedPath().includes(this)){
            this.hideCalendar()
        }
    }

    handleChangeEvents(event){
        const target = event.target
        let month = this.baseDate.month
        let year = this.baseDate.year

        if (target.id == 'month-selector') {
            this.baseDate = DateTime.fromObject({ year: year, month: target.value, day: 1 })
        } else if (target.id == 'year-selector') {
            this.baseDate = DateTime.fromObject({ year: target.value, month: month, day: 1 })
        }
    }

    setData(event){
        if (!this.disabled && !this.readonly){
            const target = event.target
            const selectedData = DateTime.fromISO( target.getAttribute('data-date') )
            const inputBox = this.renderRoot.querySelector('.value-input-box')
            inputBox.value = selectedData.toFormat('dd/MM/yyyy')
        }
        this.hideCalendar()
    }

    set disabled(val) {
        let oldVal = this._disabled
        this._disabled = val
        this.requestUpdate('disabled', oldVal)
    }
      
    get disabled() { 
        return this._disabled
    }

    dispatchChangeEvent(){
        let changeEvent = new Event('change', { bubbles: true })
        this.dispatchEvent(changeEvent)
    }

    clear(){
        this.value = null
        this.dispatchChangeEvent()
    }

    btnClear(){ 
        if (!this.disabled && !this.readonly){
            this.value = null
            this.dispatchChangeEvent()
        }
    }

    reset(){
        this.value = this._preValue
        this.dispatchChangeEvent()
    }

    setPre(){
        this._preValue = this.value
    }

    get changed(){
        return (this.value !== this.preValue)
    }

    createCalendar(){

        const today = DateTime.local()
        let baseDate

        if (this.baseDate == null || this.baseDate == undefined || this.baseDate == 'null' || this.baseDate == 'undefined'){
            if (this.value == null || this.value == undefined || this.value == 'null' || this.value == 'undefined') {
                baseDate = today
            } else {
                baseDate = DateTime.fromFormat(this.value, 'yyyy-MM-dd')
            }
            this.baseDate = baseDate
        } else {
            baseDate = this.baseDate
        }

        const selectedDate = (this.value && DateTime.fromFormat(this.value, 'yyyy-MM-dd')) ?? null

        const firstDayOfMonth = baseDate.startOf('month')
        const lastDayOfMonth = baseDate.endOf('month')
        const firstDayOfCalendar = firstDayOfMonth.startOf('week')
        const lastDayOfCalendar = lastDayOfMonth.endOf('week')
        const totalDays = Math.ceil(lastDayOfCalendar.diff(firstDayOfCalendar, 'days').toObject().days)
        const totalWeeks = totalDays / 7

        let calendarDay = firstDayOfCalendar
        let calendarDates = []

        while (!(
        calendarDay.hasSame(lastDayOfCalendar.plus({ days: 1 }), 'year') && 
        calendarDay.hasSame(lastDayOfCalendar.plus({ days: 1 }), 'month') && 
        calendarDay.hasSame(lastDayOfCalendar.plus({ days: 1 }), 'day')
        )){
            calendarDates.push(calendarDay)
            calendarDay = calendarDay.plus({ days: 1 })
        }

        let indexDay = 0
        let activeDate = firstDayOfCalendar

        let years = []
        for(let year = 2020; year<= 2040; year++){
            years.push(year)
        }

        return html`
        <div class="calendar-box">
            <div class="date-selection">
                <fx-select class='month-selector' id='month-selector' value='${baseDate.month}' type='number'>
                    <fx-select-option value="1">Janeiro</fx-select-option>
                    <fx-select-option value="2">Fevereiro</fx-select-option>
                    <fx-select-option value="3">Março</fx-select-option>
                    <fx-select-option value="4">Abril</fx-select-option>
                    <fx-select-option value="5">Maio</fx-select-option>
                    <fx-select-option value="6">Junho</fx-select-option>
                    <fx-select-option value="7">Julho</fx-select-option>
                    <fx-select-option value="8">Agosto</fx-select-option>
                    <fx-select-option value="9">Setembro</fx-select-option>
                    <fx-select-option value="10">Outubro</fx-select-option>
                    <fx-select-option value="11">Novembro</fx-select-option>
                    <fx-select-option value="12">Dezembro</fx-select-option>
                </fx-select>
                <fx-select class='year-selector'  id='year-selector' value='${baseDate.year}' type='number'>
                    ${years.map((year) => html`<fx-select-option value="${year}">${year}</fx-select-option>`)}
                </fx-select>
            </div>
            <div class="calendar-dates">
                <div class='week'>
                    <div class='week-title'>KW</div>
                    <div class='day-title'>S</div>
                    <div class='day-title'>T</div>
                    <div class='day-title'>Q</div>
                    <div class='day-title'>Q</div>
                    <div class='day-title'>S</div>
                    <div class='day-title'>S</div>
                    <div class='day-title'>D</div>
                </div>
                ${
                    map(range(totalWeeks), (week) => {
                        return html`<div class='week'>
                            ${[
                                html`<div class='week-of-year'>${activeDate.weekNumber}</div>`,
                                map(range(7), (day) => { 

                                    let dayClasses = []
                                    if (activeDate.hasSame(today, 'year') && 
                                    activeDate.hasSame(today, 'month') && 
                                    activeDate.hasSame(today, 'day')) {
                                        dayClasses.push('today')
                                    }
                                    if (selectedDate && 
                                    activeDate.hasSame(selectedDate, 'year') && 
                                    activeDate.hasSame(selectedDate, 'month') && 
                                    activeDate.hasSame(selectedDate, 'day')) {
                                        dayClasses.push('selected-date')
                                    }
                                    if (activeDate.weekday == 6) dayClasses.push('saturday')
                                    if (activeDate.weekday == 7) dayClasses.push('sunday')
                                    if (activeDate.month != baseDate.month) dayClasses.push('out-of-month')

                                    const divDay = html`<div class='day ${ dayClasses.join(" ") }' data-date='${activeDate}' 
                                    @click="${this.setData}">${activeDate.day}</div>`

                                    indexDay += 1
                                    activeDate = calendarDates[indexDay]

                                    return divDay
                                })
                            ]}
                        </div>`
                    })
                }
            </div>
        </div>
        `

    }

    render() {

        const value = DateTime.fromISO(this.value).isValid ? DateTime.fromFormat(this.value, 'yyyy-MM-dd').toFormat('dd/MM/yyyy') : ''

        return html`
            <label for="text-input" part="label" style="color: ${this.lbcolor};">${this.label}</label>
            <div class="box">
                <div class="input-box">
                    <input type="text" class="value-view-box ${this.disabled ? 'disabled' : ''}" placeholder="dd/mm/yyyy" part="input" 
                    @click="${this.showCalendar}" .value="${live(value)}" readonly>
                    <input type="text" class="value-input-box" placeholder="dd/mm/yyyy">
                    <fx-icon class="clear-icon" icon="cancel" color="var(--fx-secondary)" size="1.3rem" @click="${this.btnClear}"></fx-icon>
                </div>
                ${this.createCalendar()}
            </div>`
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent);