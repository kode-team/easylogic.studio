import { MovableItem } from "./MovableItem";

const layout_list  = ['flex', 'grid']

export class GroupItem extends MovableItem {   

    get isGroup () {
        return Boolean(this.layers.length);
    }

    isLayoutItem () {
        return layout_list.includes(this.parent.layout);
    }

    hasLayout () {
        return layout_list.includes(this.json.layout)
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