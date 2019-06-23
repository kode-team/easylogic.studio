import { Item } from "./Item";
import { editor } from "../editor";
import { Length } from "../unit/Length";

export class MovableItem extends Item {


    //////////////////////
    //
    // getters 
    //
    ///////////////////////


    get screenX () { return this.json.x || Length.px(0) }
    get screenY () { return this.json.y || Length.px(0) }
    get screenX2 () { return Length.px(this.screenX.value + this.json.width.value) }
    get screenY2 () { 
        return Length.px(this.screenY.value + this.json.height.value) 
    }    


    get screenWidth () { return this.json.width;  }

    get screenHeight () { return this.json.height;  }    

    /**
     * 화면상의 순수 위치 (left, top, width, height)
     * 
     * 상위 Layer 가 flex, grid 를 가지면 하위는 dom 기준으로 자동으로 연산 ..  
     * 
     */
    get screenRect () {
        return {
            left: this.screenX,
            top: this.screenY,
            width: this.screenWidth,
            height: this.screenHeight
        }
    }

    get centerX () { 
        var half = 0; 
        if (this.json.width.value != 0) {
            half = Math.floor(this.json.width.value / 2)
        }
        return Length.px(this.screenX.value + half) 
    }
    get centerY () { 
        var half = 0; 
        if (this.json.height.value != 0) {
            half = Math.floor(this.json.height.value / 2)
        }
        
        return Length.px(this.screenY.value + half) 
    }    


    checkInArea (area) {

        if (area.width.value === 0) {return false; }
        if (area.height.value === 0) {return false; } 
        if (area.x2.value < this.screenX.value) { return false; }
        if (area.y2.value < this.screenY.value) { return false; }
        if (area.x.value > this.screenX2.value) { return false; }
        if (area.y.value > this.screenY2.value) { return false; }
        
        return true;
    }

    toBoundCSS() {
        return {
            top: `${this.json.y}`,
            left: `${this.json.x}`,
            width: `${this.json.width}`,
            height: `${this.json.height}`
        }
    }
}