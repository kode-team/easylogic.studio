import { rectToVerties, rectToVertiesForArea } from "@core/functions/collision";
import { clone } from "@core/functions/func";
import { calculateMatrix, vertiesMap } from "@core/functions/math";
import { mat4, vec3 } from "gl-matrix";

/**
 * editor 의 viewport 를 관리한다. 
 * 
 * 
 * @class ViewportManager 
 */
export class ViewportManager {
    constructor (editor) {
        this.editor = editor; 

        this.canvasSize = null; 
        this.cachedViewport = rectToVerties(0, 0, 0, 0);
        this.mouse = vec3.create()
        this.scale = 1
        this.translate = vec3.create(),
        this.transformOrigin = vec3.create(),    
        this.maxScale = 5; 
        this.minScale = 0.25;  
        this.zoomFactor = 1; 

        this.resetWorldMatrix();            
    }


    setTransformOrigin (originVec) {
        this.transformOrigin = originVec;
        this.resetWorldMatrix()
    }

    setTransformOriginWithTranslate (newOrigin) {
        const oldOrigin = vec3.clone(this.transformOrigin);
        this.setTransformOrigin(newOrigin);
        this.setTranslate(
            vec3.add(
                [], 
                this.translate, 
                vec3.add([], oldOrigin, vec3.negate([], newOrigin))
            )
        );
    } 

    setScale (scale) {
        this.scale = Math.min(Math.max(this.minScale, scale), this.maxScale); 
        this.resetWorldMatrix()    
    } 
    
    setTranslate (translate) {
        this.translate = translate;
        this.resetWorldMatrix()    
    }

    /**
     * 2가지 기본 matrix 를 설정한다. 
     * 
     * 1. world matrix 
     * 2. scale matrix - 이동 간격을 계산할 때 주로 사용 
     * 
     * 
     */
    resetWorldMatrix () {

        this.matrix = calculateMatrix(
            mat4.fromTranslation([], this.translate),
            mat4.fromTranslation([], this.transformOrigin),
            mat4.fromScaling([], [this.scale, this.scale, 1]),
            mat4.fromTranslation([], vec3.negate([], this.transformOrigin))
        ) 
        this.matrixInverse = mat4.invert([], this.matrix)

        this.scaleMatrix = calculateMatrix(
            mat4.fromScaling([], [this.scale, this.scale, 1]),
        ) 
        this.scaleMatrixInverse = mat4.invert([], this.scaleMatrix)    

        this.refresh();
    }    

    /**
     * 
     * canvas 크기 재설정하기 
     * 
     * window 의 크기가 바뀌거나 레이아웃이 바뀌면 전체 canvas의 크기도 같이 변경해준다. 
     * 
     * @param {object} rect 
     * @param {number} rect.x
     * @param {number} rect.y
     * @param {number} rect.width
     * @param {number} rect.height
     */
    refreshCanvasSize (rect) {
        
        if (this.canvasSize) {

            const oldCanvasSize = clone(this.canvasSize);
    
            this.canvasSize = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }
        
            this.cachedViewport = rectToVerties(0, 0, this.canvasSize.width, this.canvasSize.height)
    
            this.setTransformOriginWithTranslate(
                vec3.multiply(
                    [],
                    this.transformOrigin,
                    [this.canvasSize.width/oldCanvasSize.width,this.canvasSize.height/oldCanvasSize.height,1 ]
                )
            )
    
        } else {
            this.canvasSize = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }
        
            this.cachedViewport = rectToVerties(0, 0, this.canvasSize.width, this.canvasSize.height)
    
            this.setTransformOrigin([this.canvasSize.width/2,this.canvasSize.height/2,0 ])
        }
        this.editor.emit('updateViewport')        
    }

    /**
     * 
     * 마지막 시점의 translate, origin, scale 을 적용한 viewport 의 verties 를 생성한다.  
     * 
     */
    refresh () {

        if (this.cachedViewport) {
            this.verties = vertiesMap(this.cachedViewport, this.matrixInverse);
        }

    }

    setMousePoint (x, y) {
        const origin = {
            x: x - this.canvasSize.x,
            y: y - this.canvasSize.y,
        }

        // this.state.cachedViewport = clone(this.verties);
        const newOrigin = vec3.lerp([], this.verties[0], this.verties[2], 0.5);

        const mouseX = this.verties[0][0] + (this.verties[2][0] - this.verties[0][0]) * (origin.x/this.canvasSize.width);
        const mouseY = this.verties[0][1] + (this.verties[2][1] - this.verties[0][1]) * (origin.y/this.canvasSize.height);

        this.mouse = [mouseX, mouseY, 0]

        this.setTransformOriginWithTranslate(newOrigin)

        this.editor.emit('updateViewport')        
    }

    zoom (zoomFactor) {

        const oldScale = this.scale; 
        const newScale = oldScale * zoomFactor

        this.setScale(newScale)      

        const newZoomFactor = this.scale / oldScale; 
        this.zoomFactor = newZoomFactor;        

        if (newZoomFactor !== 1)  {

          this.setTransformOriginWithTranslate(
            vec3.lerp(
              [], 
              this.mouse, 
              this.transformOrigin, 
              1 / zoomFactor
            )
          )

          this.editor.emit('updateViewport')
        }
    }

    /**
     * 
     * pan 움직이기 
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    pan (x, y, z = 0)  {

        // console.log(this.$editor.transformOrigin, [newDx, newDy, 0]);
        this.setTransformOriginWithTranslate(
          vec3.add([], this.transformOrigin, [x, y, 0])
        );
        this.editor.emit('updateViewport')        
    }

    /**
     * 특정 영역의 center 로 보내기 
     * 
     * @param {vec3[]} areaVerties 
     */
    moveLayerToCenter (areaVerties, scaleRate = -0.2) {

        const centerX = (areaVerties[0][0] + areaVerties[2][0])/2;
        const centerY = (areaVerties[0][1] + areaVerties[2][1])/2;
        const width = vec3.dist(areaVerties[0], areaVerties[1])
        const height = vec3.dist(areaVerties[0], areaVerties[3])

        const viewportCenterX = (this.verties[0][0] + this.verties[2][0])/2;
        const viewportCenterY = (this.verties[0][1] + this.verties[2][1])/2;
        const viewportWidth = vec3.dist(this.verties[0], this.verties[1])
        const viewportHeight = vec3.dist(this.verties[0], this.verties[3])

        const minRate = Math.min(viewportWidth/width, viewportHeight/height) + scaleRate;

        const dx = viewportCenterX - centerX;
        const dy = viewportCenterY - centerY;

        this.setTranslate(vec3.add([], this.translate, [dx, dy, 0]))
        this.setTransformOrigin(vec3.fromValues(centerX, centerY, 0))
        this.setScale(this.scale * minRate)

        this.editor.emit('updateViewport')        
    }

    get pos () {
        const mouseX = (this.mouse[0] - this.verties[0][0])/(this.verties[2][0] - this.verties[0][0]) * 100;
        const mouseY = (this.mouse[1] - this.verties[0][1])/(this.verties[2][1] - this.verties[0][1]) * 100;

        return [mouseX, mouseY, 0]
    }


    createAreaVerties (x, y, width, height) {
        return vertiesMap(rectToVertiesForArea(x, y, width, height), this.matrixInverse);
    }

    /**
     * 
     * @param {vec3} point 
     */
    createVertex (point) {
        return vec3.transformMat4([], point, this.matrixInverse)
    }

}