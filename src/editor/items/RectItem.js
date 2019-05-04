
import { Length } from "../unit/Length";
import { isFunction } from "../../util/functions/func";
import { Item } from "./Item";

export class RectItem {

    constructor (json) {
        this.json = this.convert({...this.getDefaultObject(), ...json})

        return new Proxy(this, {
            get: (target, key) => {
                var originMethod = target[key];
                if (isFunction(originMethod)) { // method tracking
                    return (...args) => {
                        return originMethod.apply(target, args);
                    }
                } else {
                    // getter or json property 
                    return originMethod || target.json[key]
                }
            },
            set: (target, key, value) => {
                if (this.checkField(key, value)) {
                    target.json[key] = value 
                } else {
                    throw new Error(`${value} is invalid as ${key} property value.`)
                }

                return true; 
            }
        })
    }

    //////////////////////
    //
    // getters 
    //
    ///////////////////////
    get screenX () { return this.json.x }
    get screenY () { return this.json.y }
    get screenX2 () { return Length.px(this.screenX.value + this.json.width.value) }
    get screenY2 () { return Length.px(this.screenY.value + this.json.height.value) }    
    get screenWidth () { return this.json.width;  }
    get screenHeight () { return this.json.height;  }    

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

    get screenRect () {
        return {
            left: this.screenX,
            top: this.screenY,
            width: this.screenWidth,
            height: this.screenHeight
        }
    }

    toString() {
        return JSON.stringify(this.screenRect);
    }

    /**
     * clone Item 
     */
    clone () {
        var json = JSON.parse(JSON.stringify(this.json));

        return new RectItem(json);
    }

    getDefaultObject(obj = {}) {
        return {
            x: Length.px(0),
            y: Length.px(0),
            width: Length.px(0),
            height: Length.px(0)
        }
    }

    /**
     * set json content 
     * 
     * @param {object} obj 
     */
    reset (obj) {

        if (obj instanceof Item) {
            obj = obj.toJSON()
        }

        this.json = this.convert({...this.json, ...obj})
    }

    convert (json) {

        json.width = Length.parse(json.width)
        json.height = Length.parse(json.height)
        json.x = Length.parse(json.x)
        json.y = Length.parse(json.y)        

        return json
    } 


    checkInArea (area) {

        if (area.width.value === 0) {return false; }
        if (area.height.value === 0) {return false; } 
        if (area.screenX2.value < this.screenX.value) { return false; }
        if (area.screenY2.value < this.screenY.value) { return false; }
        if (area.screenX.value > this.screenX2.value) { return false; }
        if (area.screenY.value > this.screenY2.value) { return false; }

        return true;
    }

    checkInOffset (offset) {
        if (offset.width.value === 0) {return false; }
        if (offset.height.value === 0) {return false; } 

        if (this.screenX.value > offset.width + offset.left) return false;
        if (this.screenX2.value < offset.left) return false;
        if (this.screenY.value > offset.height + offset.top) return false;
        if (this.screenY2.value < offset.top) return false;

        return true;
    }
}