import { MovableModel } from "./MovableModel";

const layout_list  = ['flex', 'grid']

export class GroupModel extends MovableModel {   

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
        const layout = this.json.layout || "default";
        return layout !== "default";
    }

    /**
     * layout 체크 
     * 
     * @param {default|flex|grid} layout 
     * @returns {boolean}
     */
    isLayout(layout) {
        const localLayout = this.json.layout || "default";        
        return localLayout === layout;
    }

    isInDefault () {
        if  (!this.isLayoutItem()) return false; 

        const parentLayout = this.parent.layout || 'default';
                
        return 'default' === parentLayout; 
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