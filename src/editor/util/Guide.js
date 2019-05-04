import { editor } from "../editor";
import { Segment } from "./Segment";
import { isNotUndefined } from "../../util/functions/func";

var MAX_DIST = 1; 

export class Guide {

    constructor () { }

    clear () {
        this.rect = null; 
        this.direction = null; 
        this.cachedItems = null; 
    }

    initialize (rect, cachedItems, direction) {
        this.direction = direction;
        this.rect = rect
        this.cachedItems = cachedItems;

        var project = editor.selection.currentProject;
        this.checkLayers = []
        if (project) {
            if (this.cachedItems.length && this.cachedItems[0].itemType == 'artboard') {
                this.checkLayers = project.artboards.filter(item => !this.cachedItems[item.id])
            } else {
                this.checkLayers = project.allItems.filter(item => !this.cachedItems[item.id] && !item.isLayoutItem())
            }

        }
    }

    compareX (A, B, dist = MAX_DIST) {
        var AX = [A.screenX.value, A.centerX.value, A.screenX2.value]
        var BX = [B.screenX.value, B.centerX.value, B.screenX2.value]

        var results = []
        AX.forEach( (ax, source) => {
            BX.forEach( (bx, target) => {
                var isSnap = Math.abs(ax - bx) <= dist;

                if (isSnap) {
                    // ax -> bx <= dist 
                    results.push({ A, B, source, target, ax, bx})
                }
            })
        })

        if (results.length) {

            var x = Segment.getXDirection(this.direction);

            var newResults = results.filter(it => it.source == x);
            if (newResults.length) {
                return newResults;
            }

            return [results[0]]
        }

        return results;
    }

    compareY (A, B, dist = MAX_DIST) {
        var AY = [A.screenY.value, A.centerY.value, A.screenY2.value]
        var BY = [B.screenY.value, B.centerY.value, B.screenY2.value]

        var results = []

        AY.forEach( (ay, source) => {
            BY.forEach( (by, target) => {
                var isSnap = Math.abs(ay - by) <= dist;

                if (isSnap) {
                    // aY -> bY <= dist 
                    results.push({ A, B, source, target, ay, by})
                }
            })
        })

        if (results.length) {       // 중첩된 것중에 하나만 표시 한다. 
            var y = Segment.getYDirection(this.direction);

            var newResults = results.filter(it => it.source == y);
            if (newResults.length) {
                return newResults;
            }

            return [results[0]]
        }        

        return results;
    }    

    compare (A, B, dist = MAX_DIST) {

        //체크 항목중 하나만 , 결국 x,y 축 하나씩만 
        var xCheckList = this.compareX(A, B, dist);    
        var yCheckList = this.compareY(A, B, dist);

        return {
            x: xCheckList,
            y: yCheckList
        };
    }

    getLayers (dist = MAX_DIST) {

        var layers = this.checkLayers;
        var xpoints = []
        var ypoints = []

        layers.forEach(B => {
            const obj = this.compare(this.rect, B, dist);
            xpoints.push(...obj.x);
            ypoints.push(...obj.y);
        })

        xpoints = xpoints.filter((_, index) => index == 0)
        ypoints = ypoints.filter((_, index) => index == 0)

        return [...xpoints, ...ypoints]

    } 

    calculate (dist = MAX_DIST) {

        var list = this.getLayers(dist);
        
        if (Segment.isMove(this.direction)) {
            list.forEach(it => this.moveSnap(it))
        } else {
            list.forEach(it => this.sizeSnap(it));
        }

        return list; 
    }

    sizeSnap(it) {
        if (isNotUndefined(it.ax)) {
            var minX, maxX, width; 
            switch(it.source) {
            case 2: 
                minX = this.rect.screenX.value; 
                maxX = it.bx;
                width = maxX - minX;   
                this.rect.width.set(width);                            
                break;
            // case 1: 
            //     minX = this.rect.screenX.value; 
            //     width = Math.round(it.bx - minX) * 2;   
            //     this.rect.width.set(width);                            
            //     break;                
            case 0: 
                minX = it.bx; 
                maxX = this.rect.screenX2.value;
                width = maxX - minX;   
                this.rect.x.set(minX);
                this.rect.width.set(width);                            
                break; 
            }


        } else {
            var minY, maxY, height; 

            switch(it.source) {
            case 2: 
                minY = this.rect.screenY.value; 
                maxY = it.by;
                height = maxY - minY;   
                this.rect.y.set(minY);
                this.rect.height.set(height);                
                break;

            // case 1: 
            //     minY = this.rect.screenY.value; 
            //     height = Math.round(it.by - minY) * 2;   
            //     this.rect.height.set(height);
            //     break;       
            case 0: 
                minY = it.by; 
                maxY = this.rect.screenY2.value;
                height = maxY - minY;   
                this.rect.y.set(minY);
                this.rect.height.set(height);                
                break; 
            }

        }
    }

    moveSnap(it) {
        if (isNotUndefined(it.ax)) {
            var distX = Math.round(this.rect.width.value / 2 * it.source);
            var minX = it.bx - distX;             
            this.rect.x.set(minX);            
        } else if (isNotUndefined(it.ay)) {
            var distY = Math.round(this.rect.height.value / 2 * it.source);
            var minY = it.by - distY;             
            this.rect.y.set(minY);              
        }

    }
}