import { Length } from "el/editor/unit/Length";

export class PerspectiveOrigin {

  /**
   * 
   * perspective-origin 속성 값 
   * 
   * perspective-origin: 50% 
   * perspective-origin: 50px 5px
   * 
   * @param {string} perspectiveOrigin 
   */
  static parseStyle (perspectiveOrigin = '50% 50%') {
    const origins = perspectiveOrigin.trim().split(' ').filter(it => it.trim())

    if (origins.length === 1) {
      return [origins[0], origins[0]].map(it => Length.parse(it))
    } 

    return origins.map(it => Length.parse(it))
  }

}