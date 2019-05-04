import { sep } from "path";

// refer to https://www.w3.org/TR/compositing-1
var modes = {
  normal ( back, source) {
    return source; 
  },
  multiply (back, source) {
    return back * source ; 
  },
  screen (back, source) {
    return back + source -(back * source);
  },
  overlay (back, source) {
    return this.hardlight(back, source)
  },
  hardlight (back, source) {
    if(source <= 0.5)
      return this.multiply(back, 2 * source)
    else
      return this.screen(back, 2 * source - 1)  
  },
  diffuse (c) {
    if(c <= 0.25)
      return ((16 * c - 12) * c + 4) * c
    else
      return Math.sqrt(c)
  },

  softlight (back, source) {
    if(source <= 0.5)
      return back - (1 - 2 * source) * back * (1 - back)
    else
      return back + (2 * source - 1) * (this.diffuse(back) - back)
  },
  difference (back, source) {
    return Math.abs(back, source);
  },
  exclusion (back, source) {
    return  back + source - 2 * back * source
  },
  darken (back, source) {
    return Math.min(back, source)
  },
  lighten (back, source) {
    return Math.max(back, source)
  },
  colordodge (back, source) {
    if(back == 0) return 0;
    else if(source == 1) return 1;
    else Math.min(1, back / (1 - source))
  },
  colorburn (back, source) {
    if(back == 1) return 1; 
    else if(source == 0) return 0; 
    else 1 - Math.min(1, (1 - back) / source)
  }
}

function separable (back, source, mode) {
  return {
    r : modes[mode](back.r / 255, source.r / 255) * 255,
    g : modes[mode](back.g / 255, source.g / 255) * 255,
    b : modes[mode](back.b / 255, source.b / 255) * 255,
    a : source.a 
  }
}

// alias 
Object.keys(modes).forEach(mode => {
  separable[mode] = function (back, source) {
    return separable(back, source, mode);
  }
})

export default separable;