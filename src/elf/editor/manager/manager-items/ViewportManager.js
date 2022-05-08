import { mat4, vec3 } from "gl-matrix";

import {
  vertiesToRectangle,
  rectRect,
  rectToVerties,
  rectToVertiesForArea,
} from "../../../core/collision";

import {
  calculateMatrix,
  calculateMatrixInverse,
  vertiesMap,
} from "elf/core/math";
import { UPDATE_VIEWPORT } from "elf/editor/types/event";

/**
 * editor 의 viewport 를 관리한다.
 *
 *
 * @class ViewportManager
 */
export class ViewportManager {
  constructor(editor) {
    this.editor = editor;
    this.context = this.editor.context;

    this.canvasSize = null;
    this.cachedViewport = rectToVerties(0, 0, 0, 0);
    this.mouse = vec3.create();
    this.scale = 1;
    (this.translate = vec3.create()),
      (this.transformOrigin = vec3.create()),
      (this.maxScale = 250);
    this.minScale = 0.05;
    this.zoomFactor = 1;

    this.resetWorldMatrix();
  }

  /**
   * transform origin 을 설정
   *
   * @param {vec3} originVec
   */
  setTransformOrigin(originVec) {
    this.transformOrigin = originVec;
    this.resetWorldMatrix();
  }

  /**
   * transformOrigin 을 설정하면서 translate 로 화면까지 옮김
   *
   * @param {vec3} newOrigin
   */
  setTransformOriginWithTranslate(newOrigin) {
    const oldOrigin = vec3.clone(this.transformOrigin);
    this.setTransformOrigin(newOrigin);
    this.setTranslate(
      vec3.add([], this.translate, vec3.subtract([], oldOrigin, newOrigin))
    );
  }

  /**
   * scale 설정
   *
   * @param {number} scale 0.3...5
   */
  setScale(scale) {
    this.scale = Math.min(Math.max(this.minScale, scale), this.maxScale);
    this.resetWorldMatrix();
  }

  /**
   * viewport 이동
   *
   * @param {vec3} translate
   */
  setTranslate(translate) {
    this.translate = translate;
    this.resetWorldMatrix();
  }

  /**
   * 2가지 기본 matrix 를 설정한다.
   *
   * 1. world matrix
   * 2. scale matrix - 이동 간격을 계산할 때 주로 사용
   *
   */
  resetWorldMatrix() {
    // css 에서 3자리 숫자만 지원하기 때문에 수치를 고정한다.
    // 예를 들어 element.style.transformOrigin = "300.3244324px 200.432332434px"; 형태로 값을 설정해도
    // 실제로 적용되는 값은 "300.3244px 200.4323px" 로 적용 된다.
    // 그렇기 때문에 화면상에서 그려지는 좌표랑 메모리(에디터) 상에서 가지고 있는 좌표랑 다른 결과가 나타난다.
    // 이유는 scale 이 작을 때는 상관 없지만 커지면 커질 수록 소수점 이하의 숫자들의 계산 값이 달라지기 때문이다.
    // 그래서 브라우저랑 비슷한 패턴으로 toFixed() 형태로 숫자를 맞춘다.
    this.translate = this.translate.map((it) => +it.toFixed(4));
    this.transformOrigin = this.transformOrigin.map((it) => +it.toFixed(4));
    this.scale = +this.scale.toFixed(4);

    this.matrix = calculateMatrix(
      mat4.fromTranslation([], this.translate),
      mat4.fromTranslation([], this.transformOrigin),
      mat4.fromScaling([], [this.scale, this.scale, 1]),
      mat4.fromTranslation([], vec3.negate([], this.transformOrigin))
    );
    this.matrixInverse = mat4.invert([], this.matrix);

    this.scaleMatrix = calculateMatrix(
      mat4.fromScaling([], [this.scale, this.scale, 1])
    );
    this.scaleMatrixInverse = mat4.invert([], this.scaleMatrix);

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
  refreshCanvasSize(rect) {
    if (this.canvasSize) {
      this.canvasSize = rect;

      this.cachedViewport = rectToVerties(
        0,
        0,
        this.canvasSize.width,
        this.canvasSize.height
      );
      const newVerties = vec3.transformMat4(
        [],
        [this.canvasSize.width, this.canvasSize.height, 0],
        this.scaleMatrixInverse
      );

      const newTransformOrigin = vec3.add([], this.verties[0], [
        newVerties[0] / 2,
        newVerties[1] / 2,
        0,
      ]);

      // translate * translateOrigin * scale * -translateOrigin = translate? * translateOrigin * scale * translateOrigin
      // matrix = translate? * translateOrigin * scale * -translateOrigin
      // matrix = translate? * newTransformOriginMatrix
      // matrix * -newTransformOriginMatrix = translate
      const newTranslate = mat4.getTranslation(
        [],
        calculateMatrix(
          this.matrix,
          calculateMatrixInverse(
            mat4.fromTranslation([], newTransformOrigin),
            this.scaleMatrix,
            mat4.invert([], mat4.fromTranslation([], newTransformOrigin))
          )
        )
      );

      this.setTranslate(newTranslate);
      this.setTransformOrigin(newTransformOrigin);
    } else {
      this.canvasSize = rect;

      this.cachedViewport = rectToVerties(
        0,
        0,
        this.canvasSize.width,
        this.canvasSize.height
      );

      this.setTransformOrigin([
        this.canvasSize.width / 2,
        this.canvasSize.height / 2,
        0,
      ]);
    }
    this.editor.emit(UPDATE_VIEWPORT);
  }

  /**
   *
   * 마지막 시점의 translate, origin, scale 을 적용한 viewport 의 verties 를 생성한다.
   *
   */
  refresh() {
    if (this.cachedViewport) {
      this.verties = vertiesMap(this.cachedViewport, this.matrixInverse);
      this.originVerties = this.verties.filter((_, index) => index < 4);
      this.originRect = vertiesToRectangle(this.originVerties);
    }
  }

  getWorldPosition(e) {
    e = e || this.context.config.get("bodyEvent");

    if (!e) {
      return this.createWorldPosition(0, 0);
    }

    return this.createWorldPosition(e.clientX, e.clientY);
  }

  /**
   * mousePoint{x, y} 를 가지고 실제 좌표를 구한다.
   *
   * @param {number} x
   * @param {number} y
   */
  createWorldPosition(x, y) {
    if (!this.canvasSize) {
      return vec3.create();
    }

    const origin = {
      x: x - this.canvasSize.x,
      y: y - this.canvasSize.y,
    };

    const mouseX =
      this.verties[0][0] +
      (this.verties[2][0] - this.verties[0][0]) *
        (origin.x / this.canvasSize.width);
    const mouseY =
      this.verties[0][1] +
      (this.verties[2][1] - this.verties[0][1]) *
        (origin.y / this.canvasSize.height);

    return [mouseX, mouseY, 0];
  }

  /**
   * 마우스 point{x, y} 를 기준으로 viewport 를 다시 맞춤
   *
   * @param {number} x
   * @param {number} y
   */
  setMousePoint(x, y) {
    this.mouse = this.createWorldPosition(x, y);

    this.setTransformOriginWithTranslate(
      vec3.lerp([], this.verties[0], this.verties[2], 0.5)
    );

    this.editor.emit(UPDATE_VIEWPORT);
  }

  zoom(zoomFactor) {
    const oldScale = this.scale;
    const newScale = oldScale * zoomFactor;

    this.setScale(newScale);

    const newZoomFactor = this.scale / oldScale;
    this.zoomFactor = newZoomFactor;

    if (newZoomFactor !== 1) {
      this.setTransformOriginWithTranslate(
        vec3.lerp([], this.mouse, this.transformOrigin, 1 / zoomFactor)
      );

      this.editor.emit(UPDATE_VIEWPORT);
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
  // eslint-disable-next-line no-unused-vars
  pan(x, y, z = 0) {
    this.setTransformOriginWithTranslate(
      vec3.add([], this.transformOrigin, [x, y, 0])
    );
    this.editor.emit(UPDATE_VIEWPORT);
  }

  /**
   * 특정 영역의 center 로 보내기
   *
   * @param {vec3[]} areaVerties
   */
  moveToCenter(areaVerties, scaleRate = -0.2, withScale = true) {
    if (!this.canvasSize) return;
    const areaCenter = vec3.lerp([], areaVerties[0], areaVerties[2], 0.5);
    const width = vec3.dist(areaVerties[0], areaVerties[1]);
    const height = vec3.dist(areaVerties[0], areaVerties[3]);

    const viewportCenter = vec3.lerp([], this.verties[0], this.verties[2], 0.5);
    const viewportWidth = vec3.dist(this.verties[0], this.verties[1]);
    const viewportHeight = vec3.dist(this.verties[0], this.verties[3]);

    const minRate = withScale
      ? Math.min(viewportWidth / width, viewportHeight / height) + scaleRate
      : 1;

    this.setTranslate(
      vec3.add(
        [],
        this.translate,
        vec3.subtract([], viewportCenter, areaCenter)
      )
    );
    this.setTransformOrigin(areaCenter);
    this.setScale(this.scale * minRate);

    this.editor.emit(UPDATE_VIEWPORT);
  }

  /**
   * 현재 mouse 포인트를 x, y 로 변환해서 넘겨준다.
   *
   * @type {number}
   * @returns {vec3}
   */
  get pos() {
    const mouseX =
      ((this.mouse[0] - this.verties[0][0]) /
        (this.verties[2][0] - this.verties[0][0])) *
      100;
    const mouseY =
      ((this.mouse[1] - this.verties[0][1]) /
        (this.verties[2][1] - this.verties[0][1])) *
      100;

    return [mouseX, mouseY, 0];
  }

  get minX() {
    return this.verties[0][0];
  }
  get maxX() {
    return this.verties[2][0];
  }
  get minY() {
    return this.verties[0][1];
  }
  get maxY() {
    return this.verties[2][1];
  }

  /**
   * center position in viewport as world
   *
   * @returns {vec3}
   */
  get center() {
    return this.verties[4];
  }

  get height() {
    return this.maxY - this.minY;
  }
  get width() {
    return this.maxX - this.minX;
  }

  // world 좌표 : 스크린 좌표 비율
  // world 좌표 1 이 스크린 좌표 어느 크기에 대응하는지 알 수 있다.
  // snap 은 이것을 기준으로 dist 로 계산한다.
  // 이것을 하는 이유는 확대 축소 할 때 world 좌표 1을 기준으로 snap 을 하다 보니
  // 너무 작게 축소 시켰을 때는 스냅이 된 것인지 아닌지 알 수가 없는상태가 된다.
  get pixelSize() {
    return Math.round(this.width / this.canvasSize.width);
  }

  checkInViewport(pointVertex) {
    const xInViewport =
      this.minX < pointVertex[0] && pointVertex[0] < this.maxX;
    const yInViewport =
      this.minY < pointVertex[1] && pointVertex[1] < this.maxY;
    return xInViewport && yInViewport;
  }

  // verties 의 rect 를 구해서 rectRect 로 충돌한다.
  checkInViewportArea(verties = []) {
    const source = vertiesToRectangle(verties);
    const target = this.originRect;

    return rectRect(
      source.x,
      source.y,
      source.width,
      source.height,
      target.x,
      target.y,
      target.width,
      target.height
    );
  }

  applyVertex(vertex) {
    return vec3.transformMat4([], vertex, this.matrix);
  }

  applyVertexInverse(vertex) {
    return vec3.transformMat4([], vertex, this.matrixInverse);
  }

  applyScaleVertex(vertex) {
    return vec3.transformMat4([], vertex, this.scaleMatrix);
  }

  applyScaleVertexInverse(vertex) {
    return vec3.transformMat4([], vertex, this.scaleMatrixInverse);
  }

  applyVerties(verties) {
    return vertiesMap(verties, this.matrix);
  }

  applyScaleVerties(verties) {
    return vertiesMap(verties, this.scaleMatrix);
  }

  applyVertiesInverse(verties) {
    return vertiesMap(verties, this.matrixInverse);
  }

  applyScaleVertiesInverse(verties) {
    return vertiesMap(verties, this.scaleMatrixInverse);
  }

  /**
   * viewport 좌표로 변환
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @returns {vec3[]}
   */
  createAreaVerties(x, y, width, height) {
    return this.applyVertiesInverse(rectToVertiesForArea(x, y, width, height));
  }

  zoomIn(zoomFactor = 0.01) {
    this.setScale(this.scale + zoomFactor);
    this.editor.emit(UPDATE_VIEWPORT);
  }

  zoomOut(zoomFactor = 0.01) {
    this.zoomIn(-zoomFactor);
  }

  zoomDefault() {
    this.setScale(1);
    this.editor.emit(UPDATE_VIEWPORT);
  }
}
