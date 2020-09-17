
import { isNotUndefined, clone } from "@core/functions/func";
import { Segment } from "@util/Segment";
import { Length } from "@unit/Length";

const MAX_DIST = 2;

/**
 * 원보 아이템의 크기를 가지고 scale 이랑 조합해서 world 의 크기를 구하는게 기본 컨셉 
 */
export default class GuideView {

    constructor (editor, selectionToolView) {
        this.$editor = editor; 
        this.$selectionToolView = selectionToolView;
    }

    get $selection (){
        return this.$editor.selection;
    }

    makeGuideCache () {

        var artboard = this.$selection.currentArtboard;
        this.cachedExtraItems = [] 
        if (artboard) {

            if (this.$selection.isArtBoard()) {
                // 선택한 영역이 artboard 일 때는  다른 객체와 거리를 재지 않는다. 
                // 하위 모든 것들이 artboard 안에 있기 때문이다. 
                this.cachedExtraItems = [];
            } else {
                this.cachedExtraItems = artboard.allLayers.filter(it => {
                    return !this.$selection.check(it) || (it.is('artboard') && this.$selection.currentArtboard != it); 
                }).map(it => {
                    return {
                        x: it.screenX.value,
                        y: it.screenY.value,
                        width: it.width.value,
                        height: it.height.value
                    }
                })
                
            }

            this.rect = this.$selection.allRect ? clone(this.$selection.allRect) : null;
        }
        
        // Rect 안의 position 의  좌표 비율 미리 캐슁 
        this.cachedPosition = {}
        this.$selection.each(item => {
            this.cachedPosition[item.id] = {
                x : item.x.value,
                y : item.y.value,
                width: item.width.value, 
                height: item.height.value,
                screenX: item.screenX.value,
                screenY: item.screenY.value,
            }
        })  

        return this.rect; 
    }


    // 그룹의 각 엣지별로 움직인 간격을  지정한다. 
    // 나중에 matrix 연산을 도입하는게 좋을 듯 하다. 
    // 최종적으로 group 이 변한 상태를 기록한다. 
    // allRect 는 초기 값 
    // rect 는 최종 값 
    // dx, dy 는 변화값 
    // rect is equals to plus both allRect and  (type, dx, dy).
    move (type, dx, dy) {
        /*  최초 캐쉬된 객체  */
        var allRect = this.$selection.allRect;

        /* this.rect 는 실제 변화가 적용된 객체 */
        this.pointerType = type; 
        this.dx = dx; 
        this.dy = dy; 

        if (type === 'move') {
            this.rect.x = allRect.x + dx; 
            this.rect.y = allRect.y + dy; 
        } else {

            if (Segment.isRight(type)) {

                this.rect.width = allRect.width + dx; 

                // 원래 x 보다 작은 영역으로 크기가 줄어 든다면 
                // 줄어든 만큼 x 를 옮기고 
                // width 를 줄어든 크기만큼 만든다. 
                if (this.rect.width < 0) {
                    this.rect.x = allRect.x + this.rect.width; 
                    this.rect.width = Math.abs(this.rect.width);
                }

            } else if (Segment.isLeft(type)) {
                this.rect.x = allRect.x + dx
                this.rect.width = allRect.width - dx; 

                // 중심축 기준으로 옮겨서 그림                 
                if (this.rect.width < 0) {
                    this.rect.x = allRect.x + allRect.width; 
                    this.rect.width = Math.abs(this.rect.width);
                }
            } 
    
            if (Segment.isBottom(type)) {      // 밑으로 향하는 애들 
                this.rect.height = allRect.height + dy;

                // 중심축 기준으로 옮겨서 그림                 
                if (this.rect.height < 0) {
                    this.rect.y = allRect.y + this.rect.height; 
                    this.rect.height = Math.abs(this.rect.height);
                }

            } else if (Segment.isTop(type)) {
                this.rect.height = allRect.height - dy;                 
                this.rect.y = allRect.y + dy; 

                // 중심축 기준으로 옮겨서 그림 
                if (this.rect.height < 0) {
                    this.rect.y = allRect.y + allRect.height; 
                    this.rect.height = Math.abs(this.rect.height);
                }                
            }                      
        }
    }


    // 해당 item 의 위치를 복구한다. 
    // 이 때 rect, allRect 의 비율에 따라 달라진다. 
    // dx, dy 는 translate 
    // width, height 는 scale 로 정의를 하면 좀 더 쉬워진다. 
    // item.[x,y] = (dx, dy) * scale 
    // item.[width,height] = (width, height) * scale 
    recover (item) {

        if (!this.rect) return; 
        var allRect = this.$selection.allRect;

        const scaleX = this.rect.width/ allRect.width ;
        const scaleY = this.rect.height/ allRect.height ;
        const cachedItem = this.cachedPosition[item.id];

        // screenX, screenY 
        const realX = this.rect.x + this.rect.width * ((cachedItem.screenX - allRect.x) / allRect.width);
        const realY = this.rect.y + this.rect.height * ((cachedItem.screenY - allRect.y) / allRect.height);

        item.reset({
            x: Length.px(cachedItem.x + (realX - cachedItem.screenX) ).round(),
            y: Length.px(cachedItem.y + (realY - cachedItem.screenY)).round(),
            width: Length.px(cachedItem.width * scaleX).round(),
            height: Length.px(cachedItem.height * scaleY).round()
        })

    } 

    compareX (A, B, dist = MAX_DIST) {

        // source and target are an index 
        // 0: start, 1 : center, 2 : end 
        var AX = [A.x, Math.floor(A.x + A.width/2), A.x + A.width]
        var BX = [B.x, Math.floor(B.x + B.width/2), B.x + B.width]

        var results = []
        AX.forEach( (ax, source) => {
            BX.forEach( (bx, target) => {
                var isSnap = Math.abs(ax - bx) <= dist;

                if (isSnap) {
                    // ax -> bx <= dist 
                    results.push({ A, B, source, target, ax: bx, bx})
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
        var AY = [A.y, Math.floor(A.y + A.height/2), A.y + A.height]
        var BY = [B.y, Math.floor(B.y + B.height/2), B.y + B.height]

        var results = []

        AY.forEach( (ay, source) => {
            BY.forEach( (by, target) => {
                var isSnap = Math.abs(ay - by) <= dist;

                if (isSnap) {
                    // aY -> bY <= dist 
                    results.push({ A, B, source, target, ay: by, by})
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
            xpoints.push(obj.x[0]);
            ypoints.push(obj.y[0]);
        })

        return [xpoints[0], ypoints[0]].filter(isNotUndefined)

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

        if (isNotUndefined(it.ax)) {
            switch(it.source) {
            case 2:    
                this.rect.width = it.bx - this.rect.x;          
                break;
            // case 1: 
            //     minX = this.rect.screenX.value; 
            //     width = Math.round(it.bx - minX) * 2;   
            //     this.rect.width.set(width);                            
            //     break;                
            case 0: 
                this.rect.width = this.rect.x + this.rect.width - it.bx;
                this.rect.x = it.bx;

                break; 
            }


        } else {
            switch(it.source) {
            case 2: 
                this.rect.height = it.by - this.rect.y; 
                break;

            // case 1: 
            //     minY = this.rect.screenY.value; 
            //     height = Math.round(it.by - minY) * 2;   
            //     this.rect.height.set(height);
            //     break;       
            case 0: 
                this.rect.height = this.rect.y + this.rect.height - it.by;             
                this.rect.y = it.by
                break; 
            }

        }
    }

    moveSnap(it) {
        if (isNotUndefined(it.ax)) {
            var distX = Math.round(this.rect.width / 2 * it.source);
            var minX = it.bx - distX;             
            this.rect.x = minX
        } else if (isNotUndefined(it.ay)) {
            var distY = Math.round(this.rect.height / 2 * it.source);
            var minY = it.by - distY;             
            this.rect.y = minY
        }

    }


    recoverAll() {
        // 좌표 복구 시스템 
        if (Segment.isMove(this.pointerType)) {

            this.$selection.each(item => {

                if (this.$selection.isInParent(item, this.$selection.items)) {
                    // 부모가 있는 애들은 스스로를 복구 하지 않는다. 
                    // console.log(item, this.$selection.items);
                } else {
                    // selection 기준으로 item 을 먼저 복구 하고 
                    this.recover(item)
        
                    // 개별 item 의 캐쉬를 기준으로 다시 복구한다. 
                    item.recover();
                }

            });
        } else {

            this.$selection.each(item => {
                // selection 기준으로 item 을 먼저 복구 하고 
                this.recover(item)
    
                // 개별 item 의 캐쉬를 기준으로 다시 복구한다. 
                item.recover();
            });
        }
    }
    
} 