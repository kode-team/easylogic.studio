// refer to https://www.w3.org/TR/compositing-1

var util = {
  lum ( color) {
    return 0.3 * color.r  + 0.59 * color.g + 0.11 * color.b;
  },

  clipColor(c) {
    const l = this.lum(c)
    const n = this.min(c)
    const x = this.max(c)

    let color = {...c};

    if(n < 0) {
      color.r = l + (((color.r - l) * l) / (l - n))
      color.g = l + (((color.g - l) * l) / (l - n))
      color.b = l + (((color.b - l) * l) / (l - n))
    }
        
                  
    if(x > 1) {
      color.r = l + (((color.r - l) * (1 - l)) / (x - l))
      color.g = l + (((color.g - l) * (1 - l)) / (x - l))
      color.b = l + (((color.b - l) * (1 - l)) / (x - l))
    }
    
    return color;
  },
  setLum(color, l) {
    const d = l - this.lum(color)
    const r = color.r + d; 
    const g = color.g + d; 
    const b = color.b + d; 
        
    return this.clipColor({r, g, b})
  },

  sat (color) {
    return  this.max(color) - this.min(color)
  },

  max (color) {
    return Math.max(color.r, color.g, color.b);
  },

  min (color) {
    return Math.min(color.r, color.g, color.b);
  },

  mid (color) {
    return (color.r + color.g + color.b) - this.max(color) - this.min(color);
  },  

  setSat(color, s) {
    color.max = this.max(color);
    color.min = this.min(color);
    color.mid = this.mid(color);

    if(color.max > color.min) {
      color.mid = (((color.mid - color.min) * s) / (color.max - color.min))
      color.max = s
    } else {
      color.mid = color.max =  0
    }
      
    color.min = 0

    return color;
  }
}

var modes = {
  /* nonseparable mode */ 
  hue (back, source) {
    return util.setLum(util.setSat(source, util.sat(back)), util.lum(back))
  },

  saturation (back, source) {
    return util.setLum(util.setSat(back, util.sat(source)), util.lum(back))
  },
  
  color (back, source) {
    return util.setLum(source, util.lum(back));
  },

  luminosity (back, source) {
    return util.setLum(back, util.lum(source))
  }

}

function recover (c) {
  c.r *= 255; 
  c.g *= 255; 
  c.b *= 255; 
  return c;
}

function minify (c) {
  c.r /= 255;
  c.g /= 255;
  c.b /= 255;
  return c;
}

function nonseparable (back, source, mode) {
  return recover(modes[mode](minify(back), minify(source)));
}

// alias 
Object.keys(modes).forEach(mode => {
  nonseparable[mode] = function (back, source) {
    return nonseparable(back, source, mode);
  }
})

export default nonseparable;