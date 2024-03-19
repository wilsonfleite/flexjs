import { LitElement, html, css } from '../refs/lit.js';
const TAG_NAME = 'fx-kanban-board'

class CustomWebComponent extends LitElement {
      
    static styles = css`
        :host {
            box-sizing: border-box;
            display: block;
            height: 100%;
        }

        .title {
            font-size: 1.1rem;
            font-weight: 500;
            margin-bottom: 0.2rem;
        }

        .container {
            background-color: var(--fx-background-soft);
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            box-sizing: border-box;
            padding: 0.8rem;
        }

        .slot {
            display: flex;
            flex-direction: row;
            gap: 0.8rem;
            box-sizing: border-box;
            height: 100%;
        }

        .filter-group {
            font-size: 0.9rem;
            font-weight: 500;
            padding: 0.2rem;
        }

        .tags-group-container {
            display: flex;
            flex-direction: row;
            gap: 1.2rem;
        }

        .tag-group {
            display: flex;
            flex-direction: row;
            gap: 0.2rem;
            flex-wrap: wrap;
        }

        .tag-group fx-kanban-tag {
            cursor: pointer;
        }

        .tags-filter-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.2rem;
            width: 100%;
        }
    `

    static properties = {}

    filterTags(){
        const tags = Array.from(this.querySelectorAll('fx-kanban-tag'))
        const cards = Array.from(this.querySelectorAll('fx-kanban-card'))

        const totalCards = cards.length

        let groups = tags.map(tag => tag.group)
        groups = [...new Set(groups)]

        return html `
        ${groups.map(group => {

            let taggedCards = 0
            let groupUniqueTags = []
            tags.forEach(tag => {
                if (tag.group == group && groupUniqueTags.filter(item => item.color == tag.color && item.text == tag.innerText) == 0){
                    groupUniqueTags.push({'text': tag.innerText, 'color': tag.color})
                }
            })

            const groupCards = cards.filter(card => {
                const cardTags = Array.from(card.querySelectorAll('fx-kanban-tag'))
                return cardTags.filter(cardTag => cardTag.group == group).length > 0
            })

            return html`<div class="filter-group">
                ${group}:
                <div class="tag-group">
                    <fx-kanban-tag group="${group}" data-text="__all__" color="var(--fx-background-low-contrast)"
                    @click=${(event)=>this.toggleAllTags(event, group)} style="opacity: 1;">Todas (${totalCards})</fx-kanban-tag>

                    ${groupUniqueTags.map(uniqueTag => { 

                        const tagCards = groupCards.filter(groupCard => {
                            const cardTags = Array.from(groupCard.querySelectorAll('fx-kanban-tag'))
                            return cardTags.filter(cardTag => cardTag.color == uniqueTag.color && cardTag.innerText == uniqueTag.text).length > 0
                        })

                        taggedCards += tagCards.length
                        return html`<fx-kanban-tag group="${group}" color="${uniqueTag.color}" @click=${this.toggleTag} 
                        data-text="${uniqueTag.text}" style="opacity: 1;">${uniqueTag.text} (${tagCards.length})</fx-kanban-tag>`

                    })}

                    ${ taggedCards < totalCards ? html`<fx-kanban-tag data-text="__others__" color="var(--fx-background-low-contrast)"
                    @click=${this.toggleTag} group="${group}" style="opacity: 1;">Outras (${totalCards - taggedCards})</fx-kanban-tag>` : html``}

                </div>
            </div>`
           
        })}`

    }

    toggleTag(event){
        const tag = event.target
        const tagVisible = tag.style.opacity == '1'
        tag.style.opacity = tagVisible ? '.3' : '1'

        this.toggleCards()
    }

    toggleAllTags(event, group){
        const tag = event.target
        const tagVisible = tag.style.opacity == '1'

        const groupTags = this.renderRoot.querySelectorAll(`fx-kanban-tag[group="${group}"]`)
        groupTags.forEach(tag => tag.style.opacity = tagVisible ? '.3' : '1')

        this.toggleCards()
    }

    toggleCards(){
        const tags = Array.from(this.querySelectorAll('fx-kanban-tag'))
        let groups = tags.map(tag => tag.group)
        groups = [...new Set(groups)]

        let groupsFilter = []
        groups.forEach(group => {
            const filterGroupTagsElements = Array.from(this.renderRoot.querySelectorAll(`fx-kanban-tag[group=${group}]:not([data-text='__all__'])`))
            let visibleGroupTags = []
            let hiddenGroupTags = []
            filterGroupTagsElements.forEach(item => {
                if (item.style.opacity == 1){
                    visibleGroupTags.push({
                        'text': item.getAttribute('data-text'), 
                        'color': item.color 
                    })
                } else {
                    hiddenGroupTags.push({
                        'text': item.getAttribute('data-text'), 
                        'color': item.color 
                    })
                }
            })
            groupsFilter.push({
                'group': group,
                'visible-tags': visibleGroupTags,
                'hidden-tags': hiddenGroupTags
            })
        })

        const cards = Array.from(this.querySelectorAll('fx-kanban-card'))
        cards.forEach(card => {
            let visible = true

            groupsFilter.forEach(itemGroup => {
                itemGroup['hidden-tags'].forEach(hiddenTag => {
                    const cardTags = Array.from(card.querySelectorAll(`fx-kanban-tag[group='${itemGroup.group}']`))

                    if (cardTags.filter(cardTag => cardTag.innerText == hiddenTag.text && cardTag.color == hiddenTag.color).length > 0){
                        visible = false
                    }

                    if (hiddenTag.text == '__others__' && cardTags.length == 0){
                        visible = false
                    }

                })
            })
        
            card.style.display = visible ? 'block' : 'none'
        })

    }

    render() {
        return html`
        ${this.title !== '' ? html`<div class="title">${this.title}</div>` : html``}
        <div class="container">
            <div class="tags-filter-container">
                <div class="tags-group-container">${this.filterTags()}</div>
            </div>
            <div class="slot">
                <slot @slotchange=${this.handleSlotchange}></slot>
            </div>
        </div> 
        `
    }

}
  
customElements.define(TAG_NAME, CustomWebComponent)