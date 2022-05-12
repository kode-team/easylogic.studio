import { Gradient } from "./Gradient";

export class SVGGradient extends Gradient {
  toString() {
    // 이건 데이타로서의 문자열 , 기본적으로  css gradient 와 유사
    return "";
  }

  toSVGString() {
    // 이건 def 에 들어갈 태그
    return "";
  }

  toFillValue() {
    // 이건 실제 fill, stroke 에 적용될 속성 값  형식
    return "";
  }
}
