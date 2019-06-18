import { MovableItem } from "./MovableItem";

const isLayout = (type) => {
    return type == 'flex' || type == 'grid'
}

export class GroupItem extends MovableItem {   

    isLayoutItem () {
        return false;
    }
    
    changeDisplay (newDisplayType) {
        var oldDisplayType = this.json.display.type;

        if (isLayout(oldDisplayType) && !isLayout(newDisplayType)){
            // flex, grid => inline, inline-block. block 으로 변화 
            // 실제 offset 데이타를 x,y,width, height 로 변환해서 등록 
            this.layers.forEach(layer => layer.changeOffsetToPosition())
        } 

        this.json.display.type = newDisplayType
    }

    hasLayout () {
        return this.json.display.isLayout()
    }

    refreshItem (callback) {

        callback && callback(this);

        this.children.forEach(child => {
            child.refreshItem(callback);
        })        
    }

}