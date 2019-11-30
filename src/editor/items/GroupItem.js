import { MovableItem } from "./MovableItem";

const layout_list  = ['flex', 'grid']

export class GroupItem extends MovableItem {   

    isLayoutItem () {
        return layout_list.includes(this.parent.layout);
    }

    hasLayout () {
        return layout_list.includes(this.json.layout)
    }

}