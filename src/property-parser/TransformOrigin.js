import { Length } from "@unit/Length";
import { TransformOriginCache } from "./TransformOriginCache";

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

    if (TransformOriginCache.has(transformOrigin)) {
      return TransformOriginCache.get(transformOrigin);
    }

    const origins = transformOrigin
                      .trim()
                      .split(' ')
                      .filter(it => it.trim())

    let parsedTransformOrigin = null;

    if (origins.length === 1) {
      parsedTransformOrigin = [origins[0], origins[0]].map(it => Length.parse(it))
    } else {
      parsedTransformOrigin = origins.map(it => Length.parse(it))
    } 

    TransformOriginCache.set(transformOrigin, parsedTransformOrigin);

    return parsedTransformOrigin;
  }

  static scale (transformOrigin, width, height)  {
    let parsedTransformOrigin = TransformOrigin.parseStyle(transformOrigin)

    const originX = parsedTransformOrigin[0].toPx(width).value
    const originY = parsedTransformOrigin[1].toPx(height).value
    const originZ = parsedTransformOrigin[2].value; 

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