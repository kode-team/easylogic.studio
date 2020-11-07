import { transform } from "@babel/core";
import TransformOriginProperty from "@ui/property/TransformOriginProperty";
import { Length } from "@unit/Length";

export class TransformOrigin {

  /**
   * 
   * transform-origin 속성 값 
   * 
   * transform-origin: 50% 
   * transform-origin: 50px 5px
   * transform-origin: 50px 5px 30px
   * 
   * @param {string} transformOrigin 
   */
  static parseStyle (transformOrigin = '50% 50% 0%') {
    const origins = transformOrigin
                      .trim()
                      .split(' ')
                      .filter(it => it.trim())

    if (origins.length === 1) {
      return [origins[0], origins[0]].map(it => Length.parse(it))
    } 

    return origins.map(it => Length.parse(it))
  }

  static scale (transformOrigin, width, height)  {
    let [
      transformOriginX, 
      transformOriginY, 
      transformOriginZ
    ] = TransformOrigin.parseStyle(transformOrigin)

    const originX = transformOriginX.toPx(width).value
    const originY = transformOriginY.toPx(height).value
    const originZ = transformOriginZ.value; 

    return [originX, originY, originZ]
  }

  static toPx (transformOrigin, width, height, distance = 0) {
    let [
      transformOriginX, 
      transformOriginY, 
      transformOriginZ
    ] = TransformOrigin.parseStyle(transformOrigin)

    transformOriginX = transformOriginX.toPx(width)
    transformOriginY = transformOriginY.toPx(height)
    transformOriginZ = transformOriginZ.toPx(distance)

    return `${transformOriginX} ${transformOriginY} ${transformOriginZ}`
  }

}