const modes = {
  'clear' : {
    alpha () { return 0; },
    color () { return 0; } 
  },
  'copy' : {
    alpha (Ab, As) {
      return As;
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs;
    }
  },
  'destination' : {
    alpha (Ab, As) {
      return Ab;
    },
    color (Ab, As, Cb, Cs) {
      return Ab * Cb;
    }
  },
  'source-over' : {
    alpha (Ab, As) {
      return As + Ab * ( 1 - As);
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs + Ab * Cb * (1 - As);
    }
  },
  'destination-over' : {
    alpha (Ab, As) {
      return As * (1 - Ab) + Ab;
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * (1 - Ab) + Ab * Cb;
    }
  },
  'source-in' : {
    alpha (Ab, As) {
      return As * Ab;
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * Ab;
    }
  },
  'destination-in' : {
    alpha (Ab, As) {
      return As * Ab;
    },
    color (Ab, As, Cb, Cs) {
      return As * Cb * Ab;
    }
  },
  'source-out' : {
    alpha (Ab, As) {
      return As * (1 - Ab);
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * (1 - Ab);
    }
  },
  'destination-out' : {
    alpha (Ab, As) {
      return Ab * (1 - As);
    },
    color (Ab, As, Cb, Cs) {
      return Ab * Cb * (1 - As);
    }
  },
  'source-atop' : {
    alpha (Ab, As) {
      return As * Ab + Ab * (1 - As);
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * Ab + Ab * Cb * (1 - As);
    }
  },
  'destination-atop' : {
    alpha (Ab, As) {
      return As * (1 - Ab) + Ab * As;
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * (1 - Ab) + Ab * Cb * As;
    }
  },
  'xor' : {
    alpha (Ab, As) {
      return As * (1 - Ab) + Ab * (1 - As);
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs * (1 - Ab) + Ab * Cb * (1 - As);
    }
  },
  'lighter' : {
    alpha (Ab, As) {
      return As + Ab
    },
    color (Ab, As, Cb, Cs) {
      return As * Cs + Ab * Cb;
    }
  }

  


}

function composite (back, source, mode) {
  return {
    r : modes[mode].color(back.a, source.a, back.r / 255, source.r / 255) * 255,
    g : modes[mode].color(back.a, source.a, back.g / 255, source.g / 255) * 255,
    b : modes[mode].color(back.a, source.a, back.b / 255, source.b / 255) * 255,
    a : modes[mode].alpha(back.a, source.a)
  }
}

// alias 
Object.keys(modes).forEach(mode => {
  composite[mode] = function (back, source) {
    return composite(back, source, mode);
  }
})

export default composite;