import { Length } from "el/editor/unit/Length";
import { Transform } from "../property-parser/Transform";
import { TransformOrigin } from "el/editor/property-parser/TransformOrigin";
import { mat4, quat, vec3 } from "gl-matrix";
import { area, calculateMatrix, calculateMatrixInverse, radianToDegree, round, vertiesMap } from "el/utils/math";
import { isFunction, isNotUndefined, isUndefined } from "el/sapa/functions/func";
import PathParser from "el/editor/parser/PathParser";
import { itemsToRectVerties, polyPoint, polyPoly, rectToVerties, toRectVerties } from "el/utils/collision";
import { BaseAssetModel } from './BaseAssetModel';

const ZERO = 0
export class MovableModel extends BaseAssetModel {

    getDefaultObject(obj = {}) {
        return super.getDefaultObject({
            angle: 0,
            x: 0,
            y: 0,
            width: 300,
            height: 300,
            ...obj
        });
    }

    ////////////////////////////////////
    //
    // getter fields
    //
    ///////////////////////////////////

    /**
     * @returns {boolean} wheather item is absolute position 
     */
    get isAbsolute() {
        return this.json.position === 'absolute';
    }

    get isDragSelectable() {
        return true;
    }

    get isBooleanItem() {
        return undefined;
    }

    /**
     * 데이타를 변경하는 시점에 자식도 같이 변경할지 결정한다.
     */
    get resizableWitChildren() {
        return false;
    }

    get transform() {
        return `rotateZ(${Length.deg(this.json.angle)})`;
    }

    get localMatrix() {
        return this._cachedLocalTransform || this.getLocalTransformMatrix()
    }

    get localMatrixInverse() {
        return this._cachedLocalTransformInverse || this.getLocalTransformMatrixInverse()
    }

    get transformWithTranslate() {
        return this._cachedTransformWithTranslate || this.getTransformWithTranslate(this)
    }

    get transformWithTranslateToTranspose() {
        return this._cachedTransformWithTranslateTranspose || mat4.transpose([], this.getTransformWithTranslate(this));
    }

    get transformWithTranslateInverse() {
        return this._cachedTransformWithTranslateInverse || mat4.invert([], this.getTransformWithTranslate(this));
    }

    get itemMatrix() {
        return this._cachedItemTransform || this.getItemTransformMatrix()
    }

    get itemMatrixInverse() {
        return this._cachedItemTransformInverse || this.getItemTransformMatrixInverse()
    }

    get absoluteMatrix() {
        return this._cachedAbsoluteMatrix || this.getAbsoluteMatrix()
    }

    get absoluteMatrixInverse() {
        return this._cachedAbsoluteMatrixInverse || this.getAbsoluteMatrixInverse()
    }

    get relativeMatrix() {
        return this._cachedRelativeMatrix || this.getRelativeMatrix()
    }

    get relativeMatrixInverse() {
        return this._cachedRelativeMatrixInverse || this.getRelativeMatrixInverse()
    }

    get verties() {
        return this._cachedVerties || this.getVerties();
    }

    get contentVerties () {
        return this._cachedContentVerties || this.getContentVerties();
    }

    get originVerties() {
        return this._cachedVertiesWithoutTransformOrigin || this.rectVerties();
    }

    get localVerties() {
        return this._cachedLocalVerties || this.getLocalVerties();
    }

    get guideVerties() {
        return this._cachedGuideVerties || this.getGuideVerties();
    }

    get areaPosition() {
        return this._cachedAreaPosition || this.getAreaPosition(this._cachedAreaWidth);
    }

    get offsetX() {
        return this.json.x;
    }

    get offsetY() {
        return this.json.y;
    }


    get screenWidth() {
        return this.json.width;
    }

    get screenHeight() {
        return this.json.height;
    }

    get y() { return this.json.y; }
    get x() { return this.json.x; }
    get width() { return this.json.width; }
    get height() { return this.json.height; }
    get angle() { return this.json.angle; }

    /** translate vector */
    get translate() { return [0, 0, 0] }

    /** scale vector */
    get scale() { return [1, 1, 1] }

    /** rotate vector */
    get rotate() { return [0, 0, degreeToRadian(angle)] }

    /** origin vector */
    get origin() {
        return TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px',
            this.screenWidth,
            this.screenHeight
        )
    }

    /** absolute origin vector */
    get absoluteOrigin () {
        return vertiesMap([this.origin], this.absoluteMatrix)[0];
    }

    /** quaternion(사원수) */
    get quat() {
        return quat.fromEuler(quat.create(), 0, 0, this.angle)
    }



    getAreaPosition(areaSize = 100) {
        const verties = this.getVerties();

        const rect = toRectVerties(verties);

        const [startRow, startColumn] = area(rect[0][0], rect[0][1], areaSize);
        const [endRow, endColumn] = area(rect[2][0], rect[2][1], areaSize);

        return {
            column: [startColumn, endColumn],
            row: [startRow, endRow]
        }
    }


    toCloneObject(isDeep = true) {
        return {
            ...super.toCloneObject(isDeep),
            ...this.attrs('x', 'y', 'right', 'bottom', 'width', 'height', 'angle')
        }
    }

    reset(obj, context = { origin: '*' }) {
        const isChanged = super.reset(obj, context);

        // transform 에 변경이 생기면 미리 캐슁해둔다. 
        if (this.hasChangedField('children', 'x', 'y', 'width', 'height', 'angle', 'transform-origin', 'transform', 'perspective', 'perspective-origin')) {
            this.refreshMatrixCache()
        }

        return isChanged;
    }


    /**
     * 부모가 변경되면 matrix 를 다시 캐쉬 한다. 
     * 
     * @param {BaseModel} otherParent 
     */
    setParentId(otherParentId) {
        super.setParentId(otherParentId);

        this.refreshMatrixCache();
    }

    refreshMatrixCache() {
        // return;
        // this.modelManager.setChanged('refreshMatrixCache', this.id, { start: true })        

        this.setCacheItemTransformMatrix();
        this.setCacheLocalTransformMatrix();
        this.setCacheAbsoluteMatrix();
        this.setCacheLocalVerties();
        this.setCacheVerties();
        this.setCacheGuideVerties();
        this.setCacheAreaPosition();

        // 자식이 있을 때는 자식의 matrix 를 자동으로 변경해서 캐슁을 다시 한다. 
        // 이걸 자동으로 하게 되면 remote 로 데이타를 변경할 수가 없으니 각자 클라이언트가 하는걸로 해야할 듯 하다. 
        // 자식이 몇개가 될지 알수 없는 상태에서 불특정 다수의 데이타를 모두 보내기가 만만치 않을수도 있음. 
        this.layers.forEach(it => {
            it.refreshMatrixCache();
        })

        // this.modelManager.setChanged('refreshMatrixCache', this.id, { end: true })                
    }

    setCacheItemTransformMatrix() {
        this._cachedItemTransform = this.getItemTransformMatrix();
        this._cachedItemTransformInverse = mat4.invert([], this._cachedItemTransform);
    }

    setCacheLocalTransformMatrix() {
        this._cachedLocalTransform = this.getLocalTransformMatrix();
        this._cachedLocalTransformInverse = mat4.invert([], this._cachedLocalTransform);

        this._cachedTransformWithTranslate = this.getTransformWithTranslate(this);
        this._cachedTransformWithTranslateInverse = mat4.invert([], this._cachedTransformWithTranslate);
        this._cachedTransformWithTranslateTranspose = mat4.transpose([], this._cachedTransformWithTranslate);
    }

    setCacheAbsoluteMatrix() {
        this._cachedAbsoluteMatrix = this.getAbsoluteMatrix();
        this._cachedAbsoluteMatrixInverse = mat4.invert([], this._cachedAbsoluteMatrix);

        this._cachedRelativeMatrix = this.getRelativeMatrix();
        this._cachedRelativeMatrixInverse = mat4.invert([], this._cachedRelativeMatrix);
    }

    setCacheVerties() {
        this._cachedVerties = this.getVerties();
        this._cachedContentVerties = this.getContentVerties();
        this._cachedVertiesWithoutTransformOrigin = this.rectVerties();
    }

    setCacheLocalVerties() {
        this._cachedLocalVerties = this.getLocalVerties();
    }

    setCacheGuideVerties() {
        this._cachedGuideVerties = this.getGuideVerties();
    }

    setCacheAreaPosition() {
        this._cachedAreaPosition = this.getAreaPosition(this._cachedAreaWidth || 100);
    }

    setCacheAreaWidth(areaWidth) {

        if (this._cachedAreaWidth !== areaWidth) {
            this._cachedAreaWidth = areaWidth;

            this.setCacheAreaPosition();
        }
    }

    /**
     * Item 이동하기 
     *  
     * @param {vec3} distVector 
     */
    move(distVector = [0, 0, 0]) {
        this.reset({
            x: round(this.offsetX + distVector[0]),          // 1px 단위로 위치 설정 
            y: round(this.offsetY + distVector[1]),
        })
    }

    moveByCenter(newCenter = [0, 0, 0]) {
        this.reset({
            x: newCenter[0] - this.screenWidth / 2,
            y: newCenter[1] - this.screenHeight / 2
        })
    }

    /**
     * world 좌표를 기준으로 이동함 
     * 
     * 
     * @param {vec3} absoluteDist 
     * @returns {{x: number, y: number}} old position
     */
    absoluteMove(absoluteDist = [0, 0, 0]) {

        // 기존 world 좌표 
        const oldVertex = this.verties[4];  // verties[4] 는 transform-origin 중심 좌표 , scale, rotate 에 영향을 받지 않는다. 

        // 새로운 world 좌표 
        const newVertex = vec3.add([], oldVertex, absoluteDist);

        // 부모를 기준으로 얼마나 움직였는지 체크해본다. 
        const newVerties = vertiesMap([ oldVertex, newVertex ], this.parent.absoluteMatrixInverse)

        const newDist = vec3.subtract([], newVerties[1], newVerties[0])

        const oldPosition = this.attrs('x', 'y');

        this.reset({
            x: this.offsetX + newDist[0],          // 1px 단위로 위치 설정 
            y: this.offsetY + newDist[1],
        })

        return oldPosition;
    }

    /**
     * 크기가 변경 될 때 자식의 후속처리를 한다. 
     */
    startToCacheChildren() { }

    recoverChildren() { }

    /**
     * constraint 조건과 같이 resize 하기  
     * 
     * @param {Length} width 
     * @param {Length} height 
     */
    resize(width, height) {
        this.startToCacheChildren();
        this.reset({ width, height })
        this.recoverChildren();
    }

    setAngle(angle = 0) {
        this.reset({
            angle
        })
    }

    addAngle(angle = 0) {
        this.setAngle(this.angle + angle);
    }

    /**
     * 충돌 체크 
     * 
     * polygon : ploygon 형태로 충돌 체크를 한다. 
     * 충돌 정확성을 위해서 item 의 개별 점이 areaVerties 에 속하는지 체크한다. 
     * 
     * @param {*} areaVerties 
     */
    checkInArea(areaVerties) {
        return polyPoly(areaVerties, this.originVerties)
    }

    /**
     * 월드 좌표 기준으로 특정 위치가 객체를 가리키고 있는데 체크한다. 
     * 
     * @param {number} x 
     * @param {number} y 
     */
    hasPoint(x, y) {
        return this.isPointInRect(x, y);
    }

    /**
     * 
     * x, y 가 verties 영역안에 있는지 체크 
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    isPointInRect(x, y) {
        return polyPoint(this.originVerties, x, y)
    }


    /**
     * areaVerties 안에 Layer 가 포함된 경우 
     * 
     * @param {vec3[]} areaVerties 
     */
    isIncludeByArea(areaVerties) {

        return this.originVerties.map(vector => {
            return polyPoint(areaVerties, ...vector);
        }).filter(Boolean).length === 4;
    }

    getPerspectiveMatrix() {

        const hasPerspective = this.json['perspective'];

        if (!hasPerspective) {
            return undefined;
        }

        let [
            perspectiveOriginX = Length.percent(50),
            perspectiveOriginY = Length.percent(50),
        ] = TransformOrigin.parseStyle(this.json['perspective-origin'])

        const width = this.screenWidth;
        const height = this.screenHeight

        perspectiveOriginX = perspectiveOriginX.toPx(width).value
        perspectiveOriginY = perspectiveOriginY.toPx(height).value

        // 1. Start with the identity matrix.
        const view = mat4.create();

        // 2. Translate by the computed X and Y values of perspective-origin     
        mat4.translate(view, view, [perspectiveOriginX, perspectiveOriginY, 0]);


        // 3. Multiply by the matrix that would be obtained from the perspective() transform function, 
        // where the length is provided by the value of the perspective property
        if (this.json['perspective'] && this.json['perspective'] != 'none') {
            mat4.multiply(view, view, mat4.fromValues(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, -1 / Length.parse(this.json['perspective']).value, 1
            ))
        } else {
            return undefined;
        }

        // 4. Translate by the negated computed X and Y values of perspective-origin
        mat4.translate(view, view, [-perspectiveOriginX, -perspectiveOriginY, 0]);

        return view;
    }

    getItemTransformMatrix() {
        const list = Transform.parseStyle(this.transform);
        const width = this.screenWidth;
        const height = this.screenHeight;

        return Transform.createTransformMatrix(list, width, height);
    }

    getItemTransformMatrixInverse() {
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
    getLocalTransformMatrix(width, height) {

        const origin = TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px',
            isUndefined(width) ? this.screenWidth : width,
            isUndefined(height) ? this.screenHeight : height
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

    getLocalTransformMatrixInverse(width, height) {
        return mat4.invert([], this.getLocalTransformMatrix(width, height));
    }

    /**
     * 방향에 따른 matrix 구하기 
     * 
     * @param {ReadOnlyVec3} vertexOffset 
     * @param {ReadOnlyVec3} center 
     */
    getDirectionTransformMatrix(vertexOffset, width, height) {
        const x = this.offsetX;
        const y = this.offsetY;

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

    getDirectionTopLeftMatrix(width, height) {
        return this.getDirectionTransformMatrix([0, 0, 0], width, height)
    }

    getDirectionLeftMatrix(width, height) {
        return this.getDirectionTransformMatrix([0, height / 2, 0], width, height)
    }


    getDirectionTopMatrix(width, height) {
        return this.getDirectionTransformMatrix([width / 2, 0, 0], width, height)
    }

    getDirectionBottomLeftMatrix(width, height) {
        return this.getDirectionTransformMatrix([0, height, 0], width, height)
    }

    getDirectionTopRightMatrix(width, height) {
        return this.getDirectionTransformMatrix([width, 0, 0], width, height)
    }

    getDirectionRightMatrix(width, height) {
        return this.getDirectionTransformMatrix([width, height / 2, 0], width, height)
    }

    getDirectionBottomRightMatrix(width, height) {
        return this.getDirectionTransformMatrix([width, height, 0], width, height)
    }

    getDirectionBottomMatrix(width, height) {
        return this.getDirectionTransformMatrix([width / 2, height, 0], width, height)
    }

    getAbsoluteMatrix() {
        let transform = mat4.create();

        if (this.parent) {
            mat4.multiply(transform, transform, this.parent.absoluteMatrix);

            // multiply parent perspective 
            if (isFunction(this.parent.getPerspectiveMatrix)) {
                const perspectiveMatrix = this.parent.getPerspectiveMatrix();
                if (perspectiveMatrix) {
                    mat4.multiply(transform, transform, perspectiveMatrix)
                }
            }

        }

        mat4.multiply(transform, transform, this.getRelativeMatrix());
        if (transform.filter(it => !isNaN(it)).length === 0) {
            return mat4.create();
        }

        return transform;
    }

    getRelativeMatrix() {
        let transform = mat4.create();

        const offsetX = this.offsetX;
        const offsetY = this.offsetY;

        // 5. Translate by offset x, y
        mat4.translate(transform, transform, [offsetX, offsetY, 0]);
        mat4.multiply(transform, transform, this.localMatrix)

        return transform;
    }

    getRelativeMatrixInverse() {
        return mat4.invert([], this.getRelativeMatrix());
    }

    getTransformWithTranslate(item) {
        item = item || this;
        let view = mat4.create();

        const offsetX = item.offsetX;
        const offsetY = item.offsetY;

        // 5. Translate by offset x, y
        mat4.translate(view, view, [offsetX, offsetY, 0]);

        mat4.multiply(view, view, item.localMatrix)

        return view;
    }

    getAbsoluteMatrixInverse() {
        return mat4.invert([], this.getAbsoluteMatrix());
    }

    getLocalVerties(width, height) {

        width = isNotUndefined(width) ? width : this.screenWidth;
        height = isNotUndefined(height) ? height : this.screenHeight;

        let model = rectToVerties(0, 0, width, height, this.json['transform-origin']);

        return model;
    }

    getVerties(width, height) {

        width = isNotUndefined(width) ? width : this.screenWidth;
        height = isNotUndefined(height) ? height : this.screenHeight;

        let model = rectToVerties(0, 0, width, height, this.json['transform-origin']);

        return vertiesMap(model, this.absoluteMatrix)
    }

    getContentVerties(width, height) {

        width = isNotUndefined(width) ? width : this.screenWidth;
        height = isNotUndefined(height) ? height : this.screenHeight;

        const center = TransformOrigin.scale( this.json['transform-origin'],  width,  height );

        const paddingTop = this.json['padding-top'] || 0;
        const paddingRight = this.json['padding-right'] || 0;
        const paddingBottom = this.json['padding-bottom'] || 0;
        const paddingLeft = this.json['padding-left'] || 0;

        const model = rectToVerties(
            0 + paddingLeft, 
            0 + paddingTop, 
            width - paddingLeft - paddingRight, 
            height - paddingTop - paddingBottom,
            this.json['transform-origin']
        );
        model[4] = center;      // origin 은 전체 기준으로 넣어줌 

        return vertiesMap(model, this.absoluteMatrix)
    }    

    rectVerties() {
        return this.verties.filter((_, index) => index < 4)
    }

    getGuideVerties() {

        const verties = this.originVerties;

        return [
            ...verties,
            vec3.lerp([], verties[0], verties[1], 0.5),
            vec3.lerp([], verties[1], verties[2], 0.5),
            vec3.lerp([], verties[2], verties[3], 0.5),
            vec3.lerp([], verties[3], verties[0], 0.5),
        ];
    }

    get toRectVerties() {
        return itemsToRectVerties([this]);
    }

    get matrix() {
        const id = this.id;
        const x = this.offsetX;
        const y = this.offsetY;
        const width = this.screenWidth;
        const height = this.screenHeight;
        const originalTransform = this.transform;
        const originalTransformOrigin = this.json['transform-origin'] || '50% 50% 0%';

        const transformOriginMatrix = this.getTransformOriginMatrix();
        const transformOriginMatrixInverse = this.getTransformOriginMatrixInverse();

        // load cached matrix 
        const parentMatrix = this.parent.absoluteMatrix;
        const parentMatrixInverse = this.parent.absoluteMatrixInverse;
        const localMatrix = this.localMatrix
        const localMatrixInverse = this.localMatrixInverse;
        const itemMatrix = this.itemMatrix;
        const itemMatrixInverse = this.itemMatrixInverse;
        const absoluteMatrix = this.absoluteMatrix;
        const absoluteMatrixInverse = this.absoluteMatrixInverse;
        const relativeMatrix = this.relativeMatrix;
        const relativeMatrixInverse = this.relativeMatrixInverse;



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
            originVerties: this.originVerties,
            xList,
            yList,
            directionMatrix,
            parentMatrix,   // 부모의 matrix 
            parentMatrixInverse,
            localMatrix,    // 자기 자신의 matrix with translate offset(x,y)
            localMatrixInverse,
            itemMatrix,     // 자기 자신의 matrix without translate offset(x,y)
            itemMatrixInverse,
            absoluteMatrix,  // parentMatrix * offset translate * localMatrix , 축적된 matrix 
            absoluteMatrixInverse,
            relativeMatrix,  // [offsetX, offsetY, 0] * localMatrix , 축적된 matrix
            relativeMatrixInverse,
            transformOriginMatrix,  // transform origin 에 대한 matrix 
            transformOriginMatrixInverse,
        }
    }

    /**
     * 중첩된 matrix 적용한 path segment 
     * 
     * @returns {PathParser} 
     */
    absolutePath(pathString = '') {

        const d = pathString || this.d;

        const pathParser = new PathParser(d)
        pathParser.transformMat4(this.absoluteMatrix);

        return pathParser;
    }

    // 전체 캔버스에 그려진 path 의 개별 verties 를 
    // svg container 의 matrix 의 inverse matrix 를 곱해서 재계산 한다.     
    invertPath(pathString = '') {
        const path = new PathParser(pathString)
        path.transformMat4(this.absoluteMatrixInverse)

        return path;
    }

    /**
     * 주어진 Point 를 로컬 좌표로 변환
     * 
     * @param {vec3} point 
     * @returns {vec3}
     */
    invertPoint(point) {
        return vec3.transformMat4([], point, this.absoluteMatrixInverse);
    }

    /**
     * pathString 의 좌표를 기준 좌표로 돌린다. 
     * 
     * @param {string} pathString   svg path string 
     */
    invertPathString(pathString = '') {
        return this.invertPath(pathString).d;
    }

    /**
     * 로컬 좌표 path (d)로 새로운 bbox 를 구한다. 
     * 
     * A -> B 로 옮겨갈 때 부모 기준으로 새로운 bbox 위치를 구할 수 있다. 
     * 
     * @param {string} d 
     * @returns 
     */
    updatePath(d) {
        const matrix = this.matrix;
        const newPath = new PathParser(d);

        // 2. 로컬 좌표로 bbox 구하기 
        let bbox = newPath.getBBox();

        // 3. newWidth, newHeight 구하기 
        const newWidth = vec3.distance(bbox[1], bbox[0]);
        const newHeight = vec3.distance(bbox[3], bbox[0]);

        // 4. bbxo 를 월드 좌표로 변환 
        let oldBBox = vertiesMap(
            rectToVerties(bbox[0][0], bbox[0][1], newWidth, newHeight),
            matrix.absoluteMatrix
        );

        // 5. 월드 좌표에서 로컬 transform 의 역행렬을 적용, 월드 좌표에서 translate 를 구함 
        //    이 때 translate 를 모르기 때문에 origin 을 bbox를 중심으로 새로 구해서 적용 
        let newBBox = vertiesMap(oldBBox, calculateMatrixInverse(
            mat4.fromTranslation([], oldBBox[4]),
            Transform.createTransformMatrix(
                Transform.parseStyle(matrix.transform),
                newWidth,
                newHeight
            ),
            mat4.fromTranslation([], vec3.negate([], oldBBox[4])),
        ));

        // 6. 월드 좌표로 변환된 bbox 의 중심으로 새로운 matrix 를 구함
        const worldMatrix = calculateMatrix(
            mat4.fromTranslation([], newBBox[0]),
            this.getLocalTransformMatrix(newWidth, newHeight),
        );


        // 7. 월드 좌표에서 부모의 상대 좌표로 변환 
        const realXY = mat4.getTranslation([], calculateMatrix(
            matrix.parentMatrixInverse,
            worldMatrix,
            mat4.invert([], this.getLocalTransformMatrix(newWidth, newHeight)),
        ));

        return {
            d: newPath.translate(-bbox[0][0], -bbox[0][1]).d,
            x: realXY[0],
            y: realXY[1],
            width: newWidth,
            height: newHeight
        }
    }

    /**
     * 나를 포함한 모든 layer 에 대해서 체크한다. 
     * 
     * project, artboard 를 제외 
     * 
     * @param {vec3[]} areaVerties 
     */
    checkInAreaForAll(areaVerties) {
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


    getTransformOriginMatrix() {
        return mat4.fromTranslation([], TransformOrigin.scale(
            this.json['transform-origin'] || '50% 50% 0px',
            this.screenWidth,
            this.screenHeight
        ))
    }

    getTransformOriginMatrixInverse() {
        return mat4.invert([], this.getTransformOriginMatrix())
    }

    /**
     * 내부 자식들의 좌표를 재구성하는 방법 
     * 
     * 현재 부모가 rect의 정보가 변경되었을 때 
     * world 좌표에서 부모를 기준으로 새로운 변환된 matrix 를 구한다. 
     * 
     * @param {object} newChildMatrix 
     */
    recoverMatrix(newChildMatrix) {

        // 새로운 offset 좌표는 아래와 같이 구한다. 
        // [newParentMatrix] * [newTranslate] * [newItemTransform] = [newAbsoluteMatrix]

        // [newTranslate] * [newItemTransform] = [newParentMatrix * -1] * [newAbsoluteMatrix]
        const matrix = calculateMatrix(
            this.absoluteMatrixInverse,
            newChildMatrix.absoluteMatrix,
        )

        // 회전 영역 먼저 구하기 
        const q = mat4.getRotation([], matrix);

        const axis = []
        const rad = quat.getAxisAngle(axis, q)
        const angle = axis[2] ? radianToDegree(rad * axis[2]) : 0;

        const newTransformMatrix = mat4.create();
        mat4.fromRotation(newTransformMatrix, rad, axis);

        // 새로 변환될 item transform 정의 
        // [newLocalMatrix] * [
        //     [origin] * [newTransformMatrix] * [origin * -1]
        //      * -1 
        // ]
        // 
        const [x, y, z] = mat4.getTranslation([], calculateMatrix(
            matrix,
            calculateMatrixInverse(
                newChildMatrix.transformOriginMatrix,
                newTransformMatrix,
                newChildMatrix.transformOriginMatrixInverse,
            )
        ));

        return { x, y, angle }
    }

    /**
     * 부모가 바뀌는 시점에 사용 , world 좌표를 기준으로 한다. 
     * 
     * 새로운 부모를 기준으로 childItem 의 transform 을 맞춘다. 
     * 
     * 1. childItem 의 absoluteMatrix 를 구한다. 
     * 2. 새로운 부모를 기준으로 좌표를 다시 맞춘다.   parentItem.absoluteMatrixInverse 
     * 
     * childItem 의 좌표를 새로운 parent 로 맞출 때는  
     * itemMatrix (rotateZ) 를 먼저 구하고 offset 을 다시 구하는 순서로 간다. 
     * 
     * @param {Item} childItem 
     */
    resetMatrix(childItem) {

        // 새로운 offset 좌표는 아래와 같이 구한다. 
        // [newParentMatrix] * [newTranslate] * [newItemTransform] = [newAbsoluteMatrix]
        // [newTranslate] * [newItemTransform] = [newParentMatrix * -1] * [newAbsoluteMatrix]
        const matrix = calculateMatrix(
            this.absoluteMatrixInverse,
            childItem.absoluteMatrix,
        )

        // 회전 영역 먼저 구하기 
        const q = mat4.getRotation([], matrix);

        const axis = []
        const rad = quat.getAxisAngle(axis, q)
        const angle = axis[2] ? radianToDegree(rad * axis[2]) : 0

        const newTransformMatrix = mat4.create();
        mat4.fromRotation(newTransformMatrix, rad, axis);

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

        childItem.reset({ x, y, angle })

        this.modelManager.setChanged('resetMatrix', this.id, { end: true, childItemId: childItem?.id })

    }

    /** order by  */

    getIndex() {
        var parentLayers = this.parent.layers;
        var startIndex = -1;
        for (var i = 0, len = parentLayers.length; i < len; i++) {
            if (parentLayers[i] === this.ref) {
                startIndex = i;
                break;
            }
        }

        return startIndex;
    }

    setOrder(targetIndex) {
        var parent = this.parent;

        var startIndex = this.getIndex()

        if (startIndex > -1) {
            parent.children[startIndex] = parent.children[targetIndex]
            parent.children[targetIndex] = this.id;

            this.modelManager.setChanged('setOrder', this.id, { targetIndex, startIndex, parentId: parent.id })
        }
    }

    // get next sibiling item 
    next() {
        if (this.isLast()) {
            return this.ref;
        }

        const index = this.getIndex();

        return this.parent.layers[index + 1];
    }

    // get prev sibiling item   
    prev() {
        if (this.isFirst()) {
            return this.ref;
        }

        const index = this.getIndex();

        return this.parent.layers[index - 1];
    }

    /**
     * 레이어를 현재의 다음으로 보낸다. 
     * 즉, 화면상에 렌더링 영역에서 올라온다. 
     */
    orderNext() {

        if (this.isLast()) {

            if (this.parent.next) {
                let next = this.parent.next();


                if (next.enableHasChildren()) {
                    next.appendChild(this);
                } else {
                    next.appendAfter(this);
                }

            }

            return;
        }

        var startIndex = this.getIndex();
        if (startIndex > -1) {
            this.setOrder(startIndex + 1);
        }
    }

    isFirst() {
        return this.getIndex() === 0;
    }

    isLast() {
        return this.getIndex() === this.parent.children.length - 1
    }

    /**
     * 레이어를 현재의 이전으로 보낸다. 
     * 즉, 화면상에 렌더링 영역에서 내려간다.
     */
    orderPrev() {
        if (this.isFirst()) {
            const prev = this.parent.prev();

            if (prev) {
                prev.appendBefore(this);
            }

            return;
        }

        var startIndex = this.getIndex();
        if (startIndex > 0) {
            this.setOrder(startIndex - 1);
        }
    }

    // 부모의 처음으로 보내기 
    orderFirst() {
        this.setOrder(0)
    }

    // 부모의 마지막으로 보내기 
    orderLast() {
        this.setOrder(this.parent.childrenLength - 1)
    }

    //TODO: 전체중에 처음으로 보내기 
    orderTop() { }
    //TODO: 전체중에 마지막으로 보내기 
    orderBottom() { }
}