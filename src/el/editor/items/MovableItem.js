import { Item } from "./Item";
import { Length } from "el/editor/unit/Length";
import { Transform } from "../property-parser/Transform";
import { TransformOrigin } from "el/editor/property-parser/TransformOrigin";
import { mat4, quat, vec3 } from "gl-matrix";
import { calculateMatrix, calculateMatrixInverse, radianToDegree, round, vertiesMap } from "el/base/functions/math";
import { isFunction } from "el/base/functions/func";
import PathParser from "el/editor/parser/PathParser";
import { itemsToRectVerties, polyPoint, polyPoly, rectToVerties } from "el/base/functions/collision";

const ZERO = Length.z()
export class MovableItem extends Item {


    /**
     * @returns {boolean} wheather item is absolute position 
     */
    get isAbsolute  (){
        return this.json.position === 'absolute'; 
    }

    /**
     * @returns {boolean} wheather item is relative position 
     */    
    get isRelative  (){
        return this.json.position === 'relative'; 
    }

    /**
     * @returns {boolean} wheather item is child 
     */    
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
            ...this.attrs('x', 'y', 'width', 'height', 'transform', 'rotate', 'rotateZ')
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

    reset(obj) {
        const isChanged = super.reset(obj);

        // transform 에 변경이 생기면 미리 캐슁해둔다. 
        if (isChanged && this.hasChangedField('x', 'y', 'width', 'height', 'transform', 'rotateZ', 'rotate', 'transform-origin', 'perspective', 'perspective-origin')) {
            this.refreshMatrixCache()
        }

        return isChanged;
    }

    /**
     * 부모가 변경되면 matrix 를 다시 캐쉬 한다. 
     * 
     * @param {Item} otherParent 
     */
    setParent (otherParent) {
        super.setParent(otherParent);

        this.refreshMatrixCache();
    }

    refreshMatrixCache() {
        this.setCacheItemTransformMatrix();
        this.setCacheLocalTransformMatrix();         
        this.setCacheAccumulatedMatrix();   
        this.setCacheVerties();
        this.setCacheGuideVerties();

        this.layers.forEach(it => {
            it.refreshMatrixCache();
        })
    }

    setCacheItemTransformMatrix() {
        this._cachedItemTransform = this.getItemTransformMatrix();
        this._cachedItemTransformInverse = mat4.invert([], this._cachedItemTransform);
    }

    setCacheLocalTransformMatrix() {
        this._cachedLocalTransform = this.getLocalTransformMatrix();
        this._cachedLocalTransformInverse = mat4.invert([], this._cachedLocalTransform);
    }    

    setCacheAccumulatedMatrix() {
        this._cachedAccumulatedMatrix = this.getAccumulatedMatrix();
        this._cachedAccumulatedMatrixInverse = mat4.invert([], this._cachedAccumulatedMatrix);
    }        

    setCacheVerties() {
        this._cachedVerties = this.getVerties();
    }

    setCacheGuideVerties() {
        this._cachedGuideVerties = this.getGuideVerties();
    }

    //////////////////////
    //
    // getters 
    //
    ///////////////////////


    get localMatrix() {
        return this._cachedLocalTransform || this.getLocalTransformMatrix()
    }

    get localMatrixInverse() {
        return this._cachedLocalTransformInverse || this.getLocalTransformMatrixInverse()
    }    

    get itemMatrix() {
        return this._cachedItemTransform || this.getItemTransformMatrix()
    }

    get itemMatrixInverse() {
        return this._cachedItemTransformInverse || this.getItemTransformMatrixInverse()
    }    

    get accumulatedMatrix() {
        return this._cachedAccumulatedMatrix || this.getAccumulatedMatrix()
    }

    get accumulatedMatrixInverse() {
        return this._cachedAccumulatedMatrixInverse || this.getAccumulatedMatrixInverse()
    }        

    get verties() {
        return this._cachedVerties || this.getVerties();
    }

    get guideVerties() {
        return this._cachedGuideVerties || this.getGuideVerties();
    }    


    setScreenX(value) {
        var absoluteX = 0;
        if (this.isChild) {
            absoluteX = this.json.parent.screenX.value; 
        }

        this.json.x.set(value - absoluteX);
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
     * Item 이동하기 
     *  
     * @param {vec3} distVector 
     */
    move (distVector = [0, 0, 0]) {
        this.reset({
            x: Length.px(this.offsetX.value + distVector[0]).round(),          // 1px 단위로 위치 설정 
            y: Length.px(this.offsetY.value + distVector[1]).round(),
        })
    }

    moveByCenter (newCenter = [0, 0, 0]) {
        const matrix = this.matrix;


        this.reset({
            x: Length.px(newCenter[0] - matrix.width/2),
            y: Length.px(newCenter[1] - matrix.height/2)
        })
    }


    /**
     * 충돌 체크 
     * 
     * polygon : ploygon 형태로 충돌 체크를 한다. 
     * 
     * @param {*} areaVerties 
     */
    checkInArea (areaVerties) {
        return polyPoly(areaVerties, this.verties)        
    }

    /**
     * 특정 위치가 객체를 가리키고 있는데 체크한다. 
     * 
     * @param {number} x 
     * @param {number} y 
     */
    hasPoint (x, y) {
        return polyPoint(this.verties, x, y)
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

        const hasPerspective = this.json['perspective'] || Transform.get(this.json['transform'] || '', 'perspective')

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

        const list = Transform.parseStyle(Transform.rotate(this.json?.['transform'] || '', this.json?.['rotate']));
        const width = this.screenWidth.value;
        const height = this.screenHeight.value;

        return Transform.createTransformMatrix(list, width, height);
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
    getLocalTransformMatrix () {
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
        mat4.multiply(view, view, this.itemMatrix)        

        // 4. Translate by the negated computed X, Y and Z values of transform-origin        
        mat4.translate(view, view, vec3.negate([], origin));

        return view; 
    }      

    getLocalTransformMatrixInverse () {
        return mat4.invert([], this.getLocalTransformMatrix());
    }

    /**
     * 방향에 따른 matrix 구하기 
     * 
     * @param {ReadOnlyVec3} vertexOffset 
     * @param {ReadOnlyVec3} center 
     */
    getDirectionTransformMatrix (vertexOffset, width, height) {
        const x = this.offsetX.value;
        const y = this.offsetY.value; 

        const center = vec3.add([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            width, 
            height
        ), vec3.negate([], vertexOffset));

        const view = mat4.create();
        mat4.translate(view, view, [x, y, 0]);
        mat4.translate(view, view, vertexOffset);            
        mat4.translate(view, view, center)        
        mat4.multiply(view, view, this.itemMatrix)        
        mat4.translate(view, view, vec3.negate([], center))            

        return view; 
    }

    getDirectionTopLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, 0, 0], width, height)
    }

    getDirectionLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, height/2, 0], width, height)
    }            
 

    getDirectionTopMatrix (width, height) {
        return this.getDirectionTransformMatrix([width/2, 0, 0], width, height)
    }    

    getDirectionBottomLeftMatrix (width, height) {
        return this.getDirectionTransformMatrix([0, height, 0], width, height)
    }    

    getDirectionTopRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, 0, 0], width, height)
    }        

    getDirectionRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, height/2, 0], width, height)
    }        

    getDirectionBottomRightMatrix (width, height) {
        return this.getDirectionTransformMatrix([width, height, 0], width, height)
    }            

    getDirectionBottomMatrix (width, height) {
        return this.getDirectionTransformMatrix([width/2, height, 0], width, height)
    }            

    getAccumulatedMatrix () {
        let transform = mat4.create();

        let path = this.path.filter(p => p.is('project') === false);

        for(let i = 0, len = path.length; i < len; i++) {

            /**
             * @type {MovableItem}
             */
            const current = path[i];

            // multiply parent perspective 
            if (current.parent && isFunction(current.parent.getPerspectiveMatrix)) {
                const perspectiveMatrix = current.parent.getPerspectiveMatrix();
                if (perspectiveMatrix) {
                    mat4.multiply(transform, transform, perspectiveMatrix)
                }
            }       
            
            const offsetX = current.offsetX.value;
            const offsetY = current.offsetY.value; 
            // 5. Translate by offset x, y
            mat4.translate(transform, transform, [offsetX, offsetY, 0]);                   
                    
            mat4.multiply(transform, transform, current.localMatrix)            
        }

        return transform;
    }

    getAccumulatedMatrixInverse () {
        return mat4.invert([], this.getAccumulatedMatrix());
    }

    getVerties (width, height) {
        let model = rectToVerties(0, 0, width || this.screenWidth.value, height || this.screenHeight.value, this.json['transform-origin']);

        return vertiesMap(model, this.accumulatedMatrix)
    }

    selectionVerties () {
        let selectionModel = rectToVerties(-6, -6, this.screenWidth.value+12, this.screenHeight.value+12, this.json['transform-origin']);
        
        return vertiesMap(selectionModel, this.accumulatedMatrix)
    }    

    rectVerties () {
        return this.verties.filter((_, index) => index < 4)
    }    

    getGuideVerties () {

        const verties = this.rectVerties();

        return [
            ...verties,
            vec3.lerp([], verties[0], verties[1], 0.5),
            vec3.lerp([], verties[1], verties[2], 0.5),
            vec3.lerp([], verties[2], verties[3], 0.5),
            vec3.lerp([], verties[3], verties[0], 0.5),
        ];
    }        

    get toRectVerties () {
        return itemsToRectVerties([this]);
    }

    get matrix () {
        const id = this.id; 
        const x =  this.offsetX.value;
        const y = this.offsetY.value;
        const width = this.screenWidth.value;
        const height = this.screenHeight.value; 
        const originalTransform = this.json.transform;
        const originalTransformOrigin = this.json['transform-origin'] || '50% 50% 0%';

        // load cached matrix 
        const parentMatrix = this.parent.accumulatedMatrix;
        const parentMatrixInverse = this.parent.accumulatedMatrixInverse;
        const localMatrix = this.localMatrix
        const localMatrixInverse = this.localMatrixInverse;
        const itemMatrix = this.itemMatrix;
        const itemMatrixInverse = this.itemMatrixInverse;
        const accumulatedMatrix = this.accumulatedMatrix;
        const accumulatedMatrixInverse = this.accumulatedMatrixInverse;

        const directionMatrix = {
            'to top left': this.getDirectionTopLeftMatrix(width, height),
            'to top': this.getDirectionTopMatrix(width, height),            
            'to top right': this.getDirectionTopRightMatrix(width, height),
            'to right': this.getDirectionRightMatrix(width, height),                        
            'to bottom left': this.getDirectionBottomLeftMatrix(width, height),
            'to bottom': this.getDirectionBottomMatrix(width, height),                        
            'to bottom right': this.getDirectionBottomRightMatrix(width, height),
            'to left': this.getDirectionLeftMatrix(width, height),                        
        }

        const verties = this.verties;
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
            /**
             * 변환되는 모든 vertex 를 기록 
             */
            verties,
            /**
             * 회전되는 vertex 를 제외한 모든 vertex 
             * 회전 방식이 바뀌면 삭제 될 수 있음. 
             */            
            rectVerties: verties,
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

        const d = pathString || this.d;

        const pathParser = new PathParser(d)
        pathParser.transformMat4(this.accumulatedMatrix);

        return pathParser; 
    }    

    // 전체 캔버스에 그려진 path 의 개별 verties 를 
    // svg container 의 matrix 의 inverse matrix 를 곱해서 재계산 한다.     
    invertPath (pathString = '') {
        const path = new PathParser(pathString)
        path.transformMat4(this.accumulatedMatrixInverse)    
    
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

            items.push.apply(items, layer.checkInAreaForLayers(areaVerties));

            if (layer.checkInArea(areaVerties)) {
                items.push(layer);
            }
        })

        return items; 
    }

    getTransformOriginMatrix () {
        return mat4.fromTranslation([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px', 
            this.screenWidth.value, 
            this.screenHeight.value
        ))
    }

    getTransformOriginMatrixInverse () {
        return mat4.invert([], this.getTransformOriginMatrix())
    }    

    /**
     * 새로운 부모를 기준으로 childItem 의 transform 을 맞춘다. 
     * 
     * 1. childItem 의 accumulatedMatrix 를 구한다. 
     * 2. 새로운 부모를 기준으로 좌표를 다시 맞춘다.   parentItem.accumulatedMatrixInverse 
     * 
     * childItem 의 좌표를 새로운 parent 로 맞출 때는  
     * itemMatrix (rotateZ) 를 먼저 구하고 offset 을 다시 구하는 순서로 간다. 
     * 
     * @param {Item} childItem 
     */
    resetMatrix (childItem) {

        // 새로운 offset 좌표는 아래와 같이 구한다. 
        // [newParentMatrix] * [newTranslate] * [newItemTransform] = [newAccumulatedMatrix]

        // [newTranslate] * [newItemTransform] = [newParentMatrix * -1] * [newAccumulatedMatrix]
        const matrix = calculateMatrix(
            this.getAccumulatedMatrixInverse(),
            childItem.getAccumulatedMatrix(),
        )

        // scale 구하기 
        const newScaleTransform = Transform.fromScale(mat4.getScaling([], matrix).map(it => round(it, 1000)));

        // 회전 영역 먼저 구하기 
        const q = mat4.getRotation([], matrix);
        const axis = []
        const rad = quat.getAxisAngle(axis, q)

        const newRotateTransform = [
            { angle : axis[0] ? radianToDegree(rad * axis[0]) : 0, type: 'rotateX' },
            { angle : axis[1] ? radianToDegree(rad * axis[1]) : 0, type: 'rotateY' },
            { angle : axis[2] ? radianToDegree(rad * axis[2]) : 0, type: 'rotateZ' },
        ]
        .filter(it => it.angle !== 0)
        .map(it => `${it.type}(${Length.deg(it.angle % 360).round(1000)})`).join(' ');

        // 새로 변환될 item transform 정의 
        const newChildItemTransform = Transform.replaceAll(childItem.transform, `${newScaleTransform} ${newRotateTransform}`)

        const list = Transform.parseStyle(newChildItemTransform);
        const width = childItem.screenWidth.value;
        const height = childItem.screenHeight.value;

        const newTransformMatrix = Transform.createTransformMatrix(list, width, height);

        // 새로 변환될 item transform 정의 
        // [newLocalMatrix] * [
        //     [origin] * [newTransformMatrix] * [origin * -1]
        //      * -1 
        // ]
        // 
        const [x, y, z] = mat4.getTranslation([], calculateMatrix(
            matrix,
            calculateMatrixInverse(
                childItem.getTransformOriginMatrix(),
                newTransformMatrix,
                childItem.getTransformOriginMatrixInverse(),
            )
        ));


        childItem.reset({
            x: Length.px(x),
            y: Length.px(y),
            transform: newChildItemTransform
        })

        childItem.refreshMatrixCache();

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