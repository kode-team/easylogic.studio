import { MovableModel } from "./MovableModel";
import { rectToVerties } from 'el/utils/collision';

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

    /**
     * padding 을 제외한 내부 content 영역을 verties 로 리턴한다. 
     * 
     */
    get contentBox () {

        const x = this['padding-left'] || 0;
        const y = this['padding-top'] || 0;

        const width = this.screenWidth.value - (this['padding-left'] || 0) - (this['padding-right'] || 0);
        const height = this.screenHeight.value - (this['padding-top'] || 0) - (this['padding-bottom'] || 0);

        return rectToVerties(x, y, width, height)
    }
}