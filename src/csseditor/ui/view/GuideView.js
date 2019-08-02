import { editor } from "../../../editor/editor";
import { isNotUndefined } from "../../../util/functions/func";
import { Segment } from "../../../editor/util/Segment";
import { Length } from "../../../editor/unit/Length";

const roundedLength = (px, fixedRound = 1) => {
    return Length.px(px).round(fixedRound);
}

const MAX_DIST = 3;

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class GuideView {
 


    makeGuideCache () {
        var artboard = editor.selection.currentArtboard;
        this.cachedExtraItems = [] 
        if (artboard) {
            this.cachedExtraItems = artboard.allLayers.filter(it => {
                return !editor.selection.check(it)
            });
            this.rect = editor.selection.allRect ? editor.selection.allRect.clone() : null;
        }
        
        // Rect 안의 position 의  좌표 비율 미리 캐슁 
        this.cachedPosition = {}
        editor.selection.items.map(item => {
            this.cachedPosition[item.id] = {
                x : this.setupX(item),
                y : this.setupY(item)
            }
        })

        return this.rect; 
    }


    move (type, dx, dy) {
        /*  최초 캐쉬된 객체  */
        var allRect = editor.selection.allRect;

        /* this.rect 는 실제 변화가 적용된 객체 */
        this.pointerType = type; 

        if (type === 'move') {
            this.rect.move( 
                roundedLength(allRect.x.value + dx),
                roundedLength(allRect.y.value + dy)
            )

        } else {

            if (Segment.isRight(type)) {
                this.rect.resizeWidth(roundedLength(allRect.width.value + dx))

            } else if (Segment.isLeft(type)) {
                if (allRect.width.value - dx >= 0) {
                    this.rect.moveX( roundedLength(allRect.x.value + dx) )
                    this.rect.resizeWidth( roundedLength(allRect.width.value - dx) )
                }                
            } 
    
            if (Segment.isBottom(type)) {      // 밑으로 향하는 애들 
                this.rect.resizeHeight( roundedLength(allRect.height.value + dy) )                
            } else if (Segment.isTop(type)) {
                if ( allRect.height.value - dy >= 0 ) {
                    this.rect.moveY( roundedLength(allRect.y.value + dy) )                                
                    this.rect.resizeHeight( roundedLength(allRect.height.value - dy) )    
                }
            }                      
        }
    }


    recover (item) {

        if (!this.rect) return; 

        const {xDistRate, x2DistRate} = this.cachedPosition[item.id].x
        const {yDistRate, y2DistRate} = this.cachedPosition[item.id].y

        const minX = this.rect.screenX.value; 
        const maxX = this.rect.screenX2.value; 
        const minY = this.rect.screenY.value; 
        const maxY = this.rect.screenY2.value; 

        const totalWidth = maxX - minX; 
        const xr = totalWidth * xDistRate;
        const x2r = totalWidth * x2DistRate; 

        const totalHeight = maxY - minY; 
        const yr = totalHeight * yDistRate;
        const y2r = totalHeight * y2DistRate;

        this.setX(item, minX, maxX, xr, x2r);
        this.setY(item, minY, maxY, yr, y2r);
    }


    setY (item, minY, maxY, yrate, y2rate) {
        var distY = Math.round(yrate);
        var distY2 = Math.round(y2rate);
        var height = distY2 - distY;

        item.setScreenY(distY + minY)
        item.height.set(height )
    }


    setX (item, minX, maxX, xrate, x2rate) {
        var distX = Math.round(xrate);
        var distX2 = Math.round(x2rate);
        var width = distX2 - distX;
        
        item.setScreenX(distX + minX) 
        item.width.set(width )
    }    

    setupX (cacheItem) {
        var allRect = editor.selection.allRect;
        var minX = allRect.screenX.value; 
        var maxX = allRect.screenX2.value; 
        var width = maxX - minX; 

        var xDistRate = (cacheItem.screenX.value - minX) / width;
        var x2DistRate = (cacheItem.screenX2.value - minX) / width;

        return {xDistRate, x2DistRate}
    }    


    setupY (cacheItem) {
        var allRect = editor.selection.allRect;        
        var minY = allRect.screenY.value; 
        var maxY = allRect.screenY2.value; 
        var height = maxY - minY; 

        var yDistRate = (cacheItem.screenY.value - minY) / height;
        var y2DistRate = (cacheItem.screenY2.value - minY) / height;

        return {yDistRate, y2DistRate}
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

            var x = Segment.getXDirection(this.pointerType);

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
            var y = Segment.getYDirection(this.pointerType);

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

        var layers = this.cachedExtraItems;
        var xpoints = []
        var ypoints = []

        layers.forEach(B => {
            const obj = this.compare(this.rect, B, dist);
            xpoints.push(...obj.x);
            ypoints.push(...obj.y);
        })

        return [xpoints[0], ypoints[0]].filter(it => isNotUndefined(it))

    } 

    calculate (dist = MAX_DIST) {

        var list = this.getLayers(dist);
        
        if (Segment.isMove(this.pointerType)) {
            list.forEach(it => this.moveSnap(it))
        } else {
            list.forEach(it => this.sizeSnap(it));
        }

        return list; 
    }

     sizeSnap(it) {

        // selection area 에 대한 정확한 정의가 필요하다. 
        // 클릭한 걸 기준으로 할지 
        // 아니면 전체 멀티 선택한 영역 자체를 기준으로 하고  그 영역 안에서 사이즈를 조절할지 
        // 고민을 다시 해봐야할 듯 하다. 

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


    recoverAll() {
        editor.selection.items.forEach(item => {
            // selection 기준으로 item 을 먼저 복구 하고 
            this.recover(item)

            // 개별 item 의 캐쉬를 기준으로 다시 복구한다. 
            item.recover();
        });
    }
    
} 