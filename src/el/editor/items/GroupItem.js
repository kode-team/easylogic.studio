import { MovableItem } from "./MovableItem";

const layout_list  = ['flex', 'grid']

export class GroupItem extends MovableItem {   

    get isGroup () {
        return Boolean(this.layers.length);
    }

    isLayoutItem () {
        return this.parent.hasLayout();
    }

    /**
     * 
     * 레이아웃을 가지고 있는 container 인지 판별
     * 
     * @returns {boolean}
     */
    hasLayout () {
        return this.json.layout !== 'default';
    }

    isInGrid () {
        if  (!this.isLayoutItem()) return false; 
                
        return 'grid' === this.parent.layout; 
    }

    isInFlex () {
        if  (!this.isLayoutItem()) return false; 

        return 'flex' === this.parent.layout 
    }

}