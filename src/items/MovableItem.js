import { Item } from "./Item";
import { Length } from "@unit/Length";
import { Transform } from "../property-parser/Transform";
import { TransformOrigin } from "@property-parser/TransformOrigin";
import { mat4, vec3 } from "gl-matrix";
import { calculateMatrix, degreeToRadian, vertiesMap } from "@core/functions/math";
import { isFunction } from "@core/functions/func";
import PathParser from "@parser/PathParser";
import { polyPoint, polyPoly, rectToVerties } from "@core/functions/collision";

const ZERO = Length.z()
export class MovableItem extends Item {


    get isAbsolute  (){
        return this.json.position === 'absolute'; 
    }

    get isRelative  (){
        return this.json.position === 'relative'; 
    }

    get isChild() {
        if (this.json.parent) {
            var isParentDrawItem = this.json.parent.is('project') === false; 

            if (isParentDrawItem && this.isAbsolute) {
                return true; 
            }
        }

        return false; 
    }

    toCloneObject(isDeep = true) {
        return {
            ...super.toCloneObject(isDeep),
            x: this.json.x + '',
            y: this.json.y + '',
            width: this.json.width + '',
            height: this.json.height + '',
        }
    }

    convert (json) {
        json = super.convert(json);

        json.x = Length.parse(json.x);
        json.y = Length.parse(json.y);
        json.width = Length.parse(json.width);
        json.height = Length.parse(json.height);

        return json; 
    }

    //////////////////////
    //
    // getters 
    //
    ///////////////////////

    setScreenX(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - absoluteX);
        this.changed();
    }

    setScreenX2(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - this.json.width.value - absoluteX + 1);
        this.changed();        
    }    

    setScreenY2(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - this.json.height.value - absoluteY + 1);
        this.changed();        
    }        


    setScreenXCenter(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - (this.json.width.value/2) - absoluteX + 1);
        this.changed();        
    }        



    setScreenYMiddle(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }

        this.json.y.set(value - (this.json.height.value/2) - absoluteY + 1);
        this.changed();        
    }            


    setScreenY(value) {
        var absoluteY = 0;
        if (this.isChild) {
            absoluteY = this.json.parent.screenY.value; 
        }
        this.json.y.set(value - absoluteY);
        this.changed();        
    }    

    get screenX () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenX.value + this.json.x.value); 
        }

        return this.json.x || Length.z() 
    }
    get screenY () { 

        if (this.isChild) {
            return Length.px(this.json.parent.screenY.value + this.json.y.value); 
        }        
        return this.json.y || Length.z() 
    }
    get screenX2 () { 
        return Length.px(this.screenX.value + this.json.width.value) 
    }
    get screenY2 () { 
        return Length.px(this.screenY.value + this.json.height.value) 
    }    


    get offsetX () { 
        if (!this.parent) {
            return this.json.x || ZERO;
        }        
        return this.json.x.toPx(this.screenWidth.value);  
    }

    get offsetY () { 
        if (!this.parent) {
            return this.json.y || ZERO;
        }        
        return this.json.y.toPx(this.screenHeight.value);  
    }
    
    get screenWidth () { 
        if (this.is('project') || !this.parent) {
            return ZERO;  
        }

        if (this.parent.is('project')) {
            return this.json.width.toPx();  
        }

        if (this.is('artboard')) {
            return this.json.width.toPx();  
        }

        return this.json.width.toPx(this.parent.screenWidth.value);  
    }    

    get screenHeight () { 
        if (this.is('project') || !this.parent) {
            return ZERO;  
        }

        if (this.parent.is('project')) {
            return this.json.height.toPx();  
        }

        if (this.is('artboard')) {
            return this.json.height.toPx();  
        }


        return this.json.height.toPx(this.parent.screenHeight.value);  
    }    

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

    /**
     * 충돌 체크 
     * 
     * polygon : ploygon 형태로 충돌 체크를 한다. 
     * 
     * @param {*} areaVerties 
     */
    checkInArea (areaVerties) {
        return polyPoly(areaVerties, this.verties())        
    }

    hasPoint (x, y) {
        return polyPoint(this.verties(), x, y)
    }


    /**
     * areaVerties 안에 Layer 가 포함된 경우 
     * 
     * @param {vec3[]} areaVerties 
     */
    isIncludeByArea (areaVerties) {

        return this.rectVerties().map(vector => {
            return polyPoint(areaVerties, ...vector);
        }).filter(Boolean).length === 4;
    }

    getPerspectiveMatrix () {

        const hasPerspective = this.json['perspective'] || Transform.get(this.json['transform'], 'perspective')

        if (!hasPerspective) {
            return undefined;
        }

        let [
            perspectiveOriginX = Length.percent(50), 
            perspectiveOriginY = Length.percent(50), 
        ] = TransformOrigin.parseStyle(this.json['perspective-origin'])

        const width = this.screenWidth.value;
        const height = this.screenHeight.value

        perspectiveOriginX = perspectiveOriginX.toPx(width).value
        perspectiveOriginY = perspectiveOriginY.toPx(height).value

        // 1. Start with the identity matrix.
        const view = mat4.create();

        // 2. Translate by the computed X and Y values of perspective-origin     
        mat4.translate(view, view, [perspectiveOriginX, perspectiveOriginY, 0]);        
        

        // 3. Multiply by the matrix that would be obtained from the perspective() transform function, 
        // where the length is provided by the value of the perspective property
        const perspective = Transform.get(this.json['transform'], 'perspective')

        if (perspective.length) {
            mat4.multiply(view, view, mat4.fromValues(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -1/perspective[0].value, 1 
            ))
        } else if (this.json['perspective'] && this.json['perspective'] != 'none' ) {
            mat4.multiply(view, view, mat4.fromValues(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -1/Length.parse(this.json['perspective']).value, 1 
            ))            
        } else {
            return undefined;
        }

        // 4. Translate by the negated computed X and Y values of perspective-origin
        mat4.translate(view, view, [-perspectiveOriginX, -perspectiveOriginY, 0]);                

        return view; 
    }

    getItemTransformMatrix () {

        const list = Transform.parseStyle(Transform.rotate(this.json['transform'], this.json['rotate']));        
         
        // start with the identity matrix 
        const view = mat4.create();

        // 3. Multiply by each of the transform functions in transform property from left to right        
        list.forEach(it => {

            switch (it.type) {
            case 'translate': 
            case 'translateX': 
            case 'translateY': 
            case 'translateZ': 
                var values = it.value
                if (it.type === 'translate') {
                    values = [values[0].toPx(width).value, values[1].toPx(height).value, 0];
                } else if (it.type === 'translateX') {
                    values = [values[0].toPx(width).value, 0, 0];
                } else if (it.type === 'translateY') {
                    values = [0, values[0].toPx(height).value, 0];
                } else if (it.type === 'translateZ') {
                    values = [0, 0, values[0].toPx().value];
                }                    

                mat4.translate(view, view, values); 
                break;
            case 'rotate': 
            case 'rotateZ':             
                // console.log('rotateZ', it.value);
                mat4.rotateZ(view, view, degreeToRadian(it.value[0].value)); 
                break;
            case 'rotateX': 
                mat4.rotateX(view, view, degreeToRadian(it.value[0].value)); 
                break;
            case 'rotateY': 
                mat4.rotateY(view, view, degreeToRadian(it.value[0].value)); 
                break;
            case 'rotate3d':             
                var values = it.value
                mat4.rotate(view, view, degreeToRadian(it.value[3].value), [
                    values[0].value,
                    values[1].value,
                    values[2].value,
                ]); 
                break;
            case 'scale': 
                mat4.scale(view, view, [it.value[0].value, it.value[1].value, 1]); 
                break;
            case 'scaleX': 
                mat4.scale(view, view, [it.value[0].value, 1, 1]); 
                break;
            case 'scaleY': 
                mat4.scale(view, view, [1, it.value[0].value, 1]); 
                break;
            case 'scaleZ': 
                mat4.scale(view, view, [1, 1, it.value[0].value]); 
                break;
            case 'matrix': 
                var values = it.value;
                values = [
                    values[0].value, values[1].value, 0, 0, 
                    values[2].value, values[3].value, 0, 0, 
                    0, 0, 1, 0, 
                    values[4].value, values[5].value, 0, 1
                ]
                mat4.multiply(view, view, values);
                break;
            case 'matrix3d': 
                var values = it.value.map(it => it.value);
                mat4.multiply(view, view, values);
                break;
            // case 'perspective': 
            //     var values = it.value;
            //     mat4.perspective(view, Math.PI * 0.5, width/height, 1, values[0].value);
            //     break;
            }
        })

        return view;
    }

    getItemTransformMatrixInverse () {
        return mat4.invert([], this.getItemTransformMatrix());
    }

    /**
     * refer to https://www.w3.org/TR/css-transforms-2/
     * 
     * 1. Start with the identity matrix.
     * 2. Translate by the computed X, Y and Z of transform-origin
     * 3. Multiply by each of the transform functions in transform property from left to right
     * 4. Translate by the negated computed X, Y and Z values of transform-origin
     */    
    getTransformMatrix () {
        const origin = TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            this.screenWidth.value, 
            this.screenHeight.value
        )

        // start with the identity matrix 
        const view = mat4.create();

        // 2. Translate by the computed X, Y and Z of transform-origin        
        mat4.translate(view, view, origin);

        // 3. Multiply by each of the transform functions in transform property from left to right        
        mat4.multiply(view, view, this.getItemTransformMatrix())        

        // 4. Translate by the negated computed X, Y and Z values of transform-origin        
        mat4.translate(view, view, vec3.negate([], origin));

        return view; 
    }      

    getTransformMatrixInverse () {
        return mat4.invert([], this.getTransformMatrix());
    }

    /**
     * 방향에 따른 matrix 구하기 
     * 
     * @param {ReadOnlyVec3} vertextOffset 
     * @param {ReadOnlyVec3} center 
     */
    getDirectionTransformMatrix (vertextOffset) {
        const x = this.offsetX.value;
        const y = this.offsetY.value; 

        const center = vec3.add([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            this.screenWidth.value, 
            this.screenHeight.value
        ), vec3.negate([], vertextOffset));

        const view = mat4.create();
        mat4.translate(view, view, [x, y, 0]);
        mat4.translate(view, view, vertextOffset);            
        mat4.translate(view, view, center)        
        mat4.multiply(view, view, this.getItemTransformMatrix())        
        mat4.translate(view, view, vec3.negate([], center))            

        return view; 
    }

    getDirectionTopLeftMatrix () {
        return this.getDirectionTransformMatrix([0, 0, 0])
    }

    getDirectionBottomLeftMatrix () {
        return this.getDirectionTransformMatrix([0, this.screenHeight.value, 0])
    }    

    getDirectionTopRightMatrix () {
        return this.getDirectionTransformMatrix([this.screenWidth.value, 0, 0])
    }        

    getDirectionBottomRightMatrix () {
        return this.getDirectionTransformMatrix([this.screenWidth.value, this.screenHeight.value, 0])
    }            


    getAccumulatedMatrix () {
        let transform = mat4.create();


        let path = this.path.filter(p => p.is('project') === false);

        path.forEach(current => {

            // multiply parent perspective 
            if (current.parent && isFunction(current.parent.getPerspectiveMatrix)) {
                const perspectiveMatrix = current.parent.getPerspectiveMatrix();
                if (perspectiveMatrix) {
                    console.log(perspectiveMatrix)
                    mat4.multiply(transform, transform, perspectiveMatrix)
                }
            }       
            
            const offsetX = current.offsetX.value;
            const offsetY = current.offsetY.value; 
            // 5. Translate by offset x, y
            mat4.translate(transform, transform, [offsetX, offsetY, 0]);                   
                    

            mat4.multiply(transform, transform, current.getTransformMatrix())
        })

        return transform;
    }

    getAccumulatedMatrixInverse () {
        return mat4.invert([], this.getAccumulatedMatrix());
    }

    verties () {

        //TODO: rectVerties 를 생성할 때 ,  중심에서 뻗어나가는 verties 를 어떻게 해야할까?
        let model = rectToVerties(0, 0, this.screenWidth.value, this.screenHeight.value, this.json['transform-origin']);

        return vertiesMap(model, this.getAccumulatedMatrix())
    }

    rectVerties () {
        return this.verties().filter((_, index) => index < 4)
    }    

    guideVerties () {
        return this.verties().filter((_, index) => index != 4)
    }        

    get matrix () {
        const id = this.id; 
        const x =  this.offsetX.value;
        const y = this.offsetY.value;
        const width = this.screenWidth.value;
        const height = this.screenHeight.value; 
        const originalTransform = this.json.transform;
        const originalTransformOrigin = this.json['transform-origin'] || '50% 50% 0%';
        const parentMatrix = (this.parent && isFunction(this.parent.getAccumulatedMatrix)) ? this.parent.getAccumulatedMatrix() : mat4.create()
        const parentMatrixInverse = mat4.invert([], parentMatrix);
        const localMatrix = this.getTransformMatrix()
        const localMatrixInverse = this.getTransformMatrixInverse();
        const itemMatrix = this.getItemTransformMatrix()
        const itemMatrixInverse = this.getItemTransformMatrixInverse();
        const accumulatedMatrix = this.getAccumulatedMatrix();
        const accumulatedMatrixInverse = this.getAccumulatedMatrixInverse();

        const directionMatrix = {
            'to top left': this.getDirectionTopLeftMatrix(),
            'to top right': this.getDirectionTopRightMatrix(),
            'to bottom left': this.getDirectionBottomLeftMatrix(),
            'to bottom right': this.getDirectionBottomRightMatrix(),
        }

        const verties = this.verties();
        const xList = verties.map(it => it[0])
        const yList = verties.map(it => it[1])

        return {
            id, 
            x, 
            y, 
            width, 
            height,
            transform: originalTransform,
            originalTransformOrigin,        
            verties,
            xList,
            yList,
            directionMatrix,
            parentMatrix,   // 부모의 matrix 
            parentMatrixInverse,
            localMatrix,    // 자기 자신의 matrix with translate offset(x,y)
            localMatrixInverse,    
            itemMatrix,     // 자기 자신의 matrix without translate offset(x,y)
            itemMatrixInverse,
            accumulatedMatrix,  // parentMatrix * offset translate * localMatrix , 축적된 matrix 
            accumulatedMatrixInverse,
        }
    }


    /**
     * 
     * @returns {vec3[]} 패스의 verties 
     */
    pathVerties () {
        return this.accumulatedPath().verties; 
    }

    /**
     * 중첩된 matrix 적용한 path segment 
     * 
     * @returns {PathParser} 
     */
    accumulatedPath (pathString = '') {

        const d = pathString || this.json.d;

        const pathParser = new PathParser(d);


        const transform = this.getAccumulatedMatrix();

        pathParser.transformMat4(transform);

        return pathParser; 
    }    

    // 전체 캔버스에 그려진 path 의 개별 verties 를 
    // svg container 의 matrix 의 inverse matrix 를 곱해서 재계산 한다.     
    invertPath (pathString = '') {
        const path = new PathParser(pathString)
        path.transformMat4(this.getAccumulatedMatrixInverse())    
    
        return path; 
    }

    /**
     * pathString 의 좌표를 기준 좌표로 돌린다. 
     * 
     * @param {string} pathString   svg path string 
     */
    invertPathString (pathString = '') {
        return this.invertPath(pathString).d;
    }

    /**
     * 나를 포함한 모든 layer 에 대해서 체크한다. 
     * 
     * project, artboard 를 제외 
     * 
     * @param {vec3[]} areaVerties 
     */
    checkInAreaForAll (areaVerties) {
        const items = [...this.checkInAreaForLayers(areaVerties)];

        if (this.is('artboard')) return items;
        if (this.is('project')) return items;

        if (this.checkInArea(areaVerties)) {
            // ref 를 넘겨야 proxy 기능을 그대로 사용 할 수 있다. 
            // 그렇지 않으면 일반적인 객체에 접근 하는 것 밖에 안된다. 즉, json 을 사용할 수가 없다. 
            items.push(this.ref);       
        }

        return items; 
    }

    /**
     * area 에 속하는지 충돌 체크, 
     * 
     * @param {vec3[]} areaVerties 
     * @returns {Item[]}  충돌 체크된 선택된 객체 리스트 
     */
    checkInAreaForLayers(areaVerties) {
        var items = [] 
        this.layers.forEach(layer => {

            items.push(...layer.checkInAreaForLayers(areaVerties));

            if (layer.checkInArea(areaVerties)) {
                items.push(layer);
            }
        })

        return items; 
    }


    /**
     * 부모를 기준으로 childItem 의 transform 을 맞춘다. 
     * 
     * [newParentInverse] * [childMatrix] * [childItemMatrixInverse] = translate; 
     * 
     * @param {Item} childItem 
     */
    resetMatrix (childItem) {

        const [x, y] = mat4.getTranslation([], calculateMatrix(
            this.getAccumulatedMatrixInverse(),
            childItem.getAccumulatedMatrix(),
            childItem.getTransformMatrixInverse()
        ));

        childItem.reset({
            x: Length.px(x),
            y: Length.px(y),
        })

    }

    /** order by  */

    getIndex () {
        var parentLayers = this.json.parent.layers;    
        var startIndex = -1; 
        for(var i = 0, len = parentLayers.length; i < len; i++) {
            if (parentLayers[i] === this.ref) {
                startIndex = i; 
                break;
            }
        }

        return startIndex;
    }

    setOrder (targetIndex) {
        var parent = this.json.parent; 

        var startIndex = this.getIndex()

        if (startIndex > -1) {
        parent.layers[startIndex] = parent.layers[targetIndex]
        parent.layers[targetIndex] = this.ref; 
        }
    }

    // get next sibiling item 
    next () {
        if (this.isLast()) {
        return this.ref; 
        }

        const index = this.getIndex();

        return this.json.parent.layers[index+1];
    }

    // get prev sibiling item   
    prev () {
        if (this.isFirst()) {
        return this.ref; 
        }

        const index = this.getIndex();

        return this.json.parent.layers[index-1];    
    }

    /**
     * 레이어를 현재의 다음으로 보낸다. 
     * 즉, 화면상에 렌더링 영역에서 올라온다. 
     */
    orderNext() {   

        if (this.isLast()) {
        // 마지막 일 때는  
        // parent 의 next 의 첫번째 요소가 된다. 
        if (this.json.parent.is('artboard')) {    // 부모가 artboard 이면  더이상 갈 곳이 없다. 
            return; 
        }

        this.json.parent.next().add(this, 'prepend')
        return; 
        }

        var startIndex = this.getIndex();
        if (startIndex > -1) {
            this.setOrder(startIndex + 1);
        }
    }

    isFirst () {
        return this.getIndex() === 0;
    }

    isLast () {
        return this.getIndex() === this.json.parent.layers.length-1
    }

    /**
     * 레이어를 현재의 이전으로 보낸다. 
     * 즉, 화면상에 렌더링 영역에서 내려간다.
     */  
    orderPrev () {
        if (this.isFirst()) {
        // 처음 일 때는  
        // parent 의 prev 의 마지막 요소가 된다.

        if (this.json.parent.is('artboard')) {    // 부모가 artboard 이면  더이상 갈 곳이 없다. 
            return; 
        }

        this.json.parent.prev().add(this)
        return; 
        }

        var startIndex = this.getIndex();
        if (startIndex > 0) {
        this.setOrder(startIndex - 1);
        }
    }

    // 부모의 처음으로 보내기 
    orderFirst () {
        this.setOrder(0)
    }

    // 부모의 마지막으로 보내기 
    orderLast () {
        this.setOrder(this.json.parent.layers.length-1)
    }

    //TODO: 전체중에 처음으로 보내기 
    orderTop() {}
    //TODO: 전체중에 마지막으로 보내기 
    orderBottom () {}
}