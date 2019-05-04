import separable from './blend/separable'
import nonseparable from './blend/non-separable'
import composite from './blend/composite'

function num(n) {
  if (n < 0) return 0; 
  return n > 255 ? 255 : n; 
}

function Blender (back, source, blendFunction, blendMode = 'normal', compositeOperation = 'source-over')  {

  const compositeFunction = composite[compositeOperation];

  return compositeFunction(back, blendFunction(back, source, blendMode));

}

Object.keys(separable).forEach(mode => {
  Blender[mode] = function (back, source, compositeOperation = 'source-over') {
    return Blender(back, source, separable[mode],mode, compositeOperation)
  }
})
Object.keys(nonseparable).forEach(mode => {
  Blender[mode] = function (back, source, compositeOperation = 'source-over') {
    return Blender(back, source, nonseparable[mode],mode, compositeOperation)
  }
})

export default Blender