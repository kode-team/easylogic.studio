import { rgb } from "../../util/functions/formatter";
import { LinearGradient } from "../image-resource/LinearGradient";
import { ColorStep } from "../image-resource/ColorStep";
import { RadialGradient } from "../image-resource/RadialGradient";
import { Length } from "../unit/Length";
import { ConicGradient } from "../image-resource/ConicGradient";
import { Project } from "../items/Project";
import { ArtBoard } from "../items/ArtBoard";
import { Layer } from "../items/Layer";
import { BackgroundImage } from "../css-property/BackgroundImage";
import { FileImageResource } from "../image-resource/URLImageResource";
import { CSS_TO_STRING, keyEach, combineKeyArray, isString } from "../../util/functions/func";
import { calculateAngle } from "../../util/functions/math";
import { SVGLayer } from "../items/layers/SVGLayer";
import { SVGPathItem } from "../items/layers/SVGPathItem";
import { SVGRectLayer } from "../items/layers/SVGRectLayer";
import { SVGEllipseLayer } from "../items/layers/SVGEllipseLayer";

export const Sketch = {
  Style: {
    FillType: {
      Color: 0,
      Gradient: 1,
      Pattern: 2
    },
    PatternFillType: {
      Tile: 0,
      Fill: 1,
      Stretch: 2,
      Fit: 3
    },
    GradientType: {
      Linear: 0,
      Radial: 1,
      Angular: 2
    }
  },
  ShapePath: {
    ShapeType: {
      Rectangle: 0,
      Oval: 1,
      Triangle: 2,
      Polygon: 3,
      Star: 4,
      Custom: 5
    }
  },
  CurvePoint: {
    PointType: {
      Undefined: 0,
      Straight: 1,
      Mirrored: 2,
      Asymmetric: 3,
      Disconnected: 4
    }
  }
};

export const SketchUtil = {
  
  makeFill (layer) {
    var results = {} 
    var images = [] 

    if (layer.style) {
      var fills = layer.style.fills || []

      fills.forEach(fillObject => {

        switch(fillObject.fillType) {
        case Sketch.Style.FillType.Color:
          results['background-color'] = SketchUtil.makeColor(fillObject.color)
          break; 
        case Sketch.Style.FillType.Gradient:
          var gradient = SketchUtil.makeGradient(layer, fillObject);
          var fill = new BackgroundImage({ image: gradient})

          images.push(fill);
          break;
        case Sketch.Style.FillType.Pattern:

          var image = new FileImageResource({
            datauri: this.sketchData[fillObject.pattern.image._ref]
          })
          
          switch(fillObject.pattern.patternType) {
          case Sketch.Style.PatternFillType.Tile:
            var fill = new BackgroundImage({
              repeat: 'repeat',
              image
            })
      
            images.push(fill);
            break;
          case Sketch.Style.PatternFillType.Fill:
            var fill = new BackgroundImage({
              size: 'cover',
              repeat: 'no-repeat',
              image
            })
      
            images.push(fill);
            break;  
          case Sketch.Style.PatternFillType.Stretch: 
            var fill = new BackgroundImage({
              size: 'auto',
              width: Length.percent(100),
              height: Length.percent(100),
              image
            })
      
            images.push(fill);
            break;
          case Sketch.Style.PatternFillType.Fit: 
            var fill = new BackgroundImage({
              repeat: 'no-repeat',
              image
            })
      
            images.push(fill);
            break;                                    
          }
          
          break; 
        }
      })
    }

    if (layer._class === 'bitmap') {
      var fill = new BackgroundImage({
        image: new FileImageResource({
          datauri: this.sketchData[layer.image._ref]
        })
      })

      images.push(fill);
    }

    if (images.length) {
      results['background-image'] = CSS_TO_STRING(this.toPropertyCSS(images))
    }

    return results

  },



  toPropertyCSS(list, isExport = false) {
    var results = {};
    list.forEach(item => {
        keyEach(item.toCSS(isExport), (key, value) => {
            if (!results[key]) results[key] = [];
            results[key].push(value);
        });
    });

    return combineKeyArray(results);
  },

  convertAxis (axis, multi = 100) {

    if (isString(axis) === false) {
      return axis;
    }

    const [x, y] = axis.substring(1, axis.length-2).split(',').map(it => Length.percent(it.trim()).mul(multi))

    return { x, y }
  },

  convertGradient (gradient) {

    var from = this.convertAxis(gradient.from)
    var to = this.convertAxis(gradient.to)    

    return {
      from,
      to
    }
  },

  makeGradient (layer, fillObject) {

    var results = null; 

    var colorsteps = fillObject.gradient.stops.map( (it, index) => {
      return new ColorStep({
        color: this.makeColor(it.color),
        percent: it.position * 100,
        index: (index + 1)  * 100 
      })
    })

    var gradient = this.convertGradient(fillObject.gradient)

    switch(fillObject.gradient.gradientType) {
    case Sketch.Style.GradientType.Linear: 

      var centerX = (gradient.from.x.value + gradient.to.x.value)/2;
      var centerY = (gradient.from.y.value + gradient.to.y.value)/2;

      results = new LinearGradient({
        angle: calculateAngle(centerX - 50, centerY - 50),
        colorsteps
      })
      break;

    case Sketch.Style.GradientType.Radial: 

      results = new RadialGradient({
        radialType: fillObject.gradient.aspectRatio === 1 ? 'circle' :  "ellipse",
        radialPosition: [gradient.from.x, gradient.from.y],
        colorsteps
      })

      break;
    case Sketch.Style.GradientType.Angular: 

      var centerX = (gradient.from.x.value + gradient.to.x.value)/2;
      var centerY = (gradient.from.y.value + gradient.to.y.value)/2;
      
      results = new ConicGradient({
        angle: calculateAngle(centerX - 50, centerY - 50),
        radialPosition: [gradient.from.x, gradient.from.y],
        colorsteps
      })      

      break;            
    }

    return results;
  },

  makeColor (colorObject) {
    return rgb({
      r: colorObject.red*255,
      g: colorObject.green*255,
      b: colorObject.blue*255,
      a: colorObject.alpha
    })
  },

  makeFrame (obj) {

    var distX = 0;
    var distY = 0;

    if (obj._class === 'artboard') {
      distX = 300;
      distY = 300;
    }

    return {
      x: Length.px(obj.frame.x + distX),
      y: Length.px(obj.frame.y + distY),
      width: Length.px(obj.frame.width),
      height: Length.px(obj.frame.height),
    }

  },

  makePath (obj) {

    if (!obj.path) return {}; 
    var path = [] 
    var points = obj.path.points.map(p => {
      p.curveFrom = this.convertAxis(p.curveFrom)
      p.curveTo = this.convertAxis(p.curveTo)
      p.point = this.convertAxis(p.point)
      return p; 

    })

    obj.path.points = points;

    
    path.push({
      command: 'M',
      values: [points[0].x, points[0].y]
    })

    points.forEach(p => {

      switch(p.curveMode) {
        case Sketch.CurvePoint.PointType.Undefined: break; 
        case Sketch.CurvePoint.PointType.Straight: 
          // 직선
          path.push({
            command: 'L',
            values:  [ p.point.x, p.point.y ] 
          }) 
          break; 
          // L 
          // cornerRadius 가 있으면  Q 로 될 까? 
        case Sketch.CurvePoint.PointType.Mirrored: break; 
          // C 
        case Sketch.CurvePoint.PointType.Asymmetric: break; 
          // 비대칭 
        case Sketch.CurvePoint.PointType.Disconnected: 
          // s , 한쪽으로 끊어진 것들 
        break; 
        }
  
  
    })

    return {
      path: obj.path 
    }; 
  },

  makeBackgroundColor (obj) {

    if (!obj.backgroundColor) {
      return {
        'background-color' : 'rgba(0, 0, 0, 0)'
      }
    }

    return {
      'background-color': SketchUtil.makeColor(obj.backgroundColor)
    }
  },

  newOriginLayerClass(layer) {
    var LayerClass = Layer;

    if (layer._class === 'shapeGroup') {
      LayerClass = SVGLayer;
    } else if (layer._class === 'shapePath') {
      LayerClass = SVGPathItem;
    } else if (layer._class === 'rectangle') {
      LayerClass = SVGRectLayer;      
    } else if (layer._class === 'oval') {
      LayerClass = SVGEllipseLayer;            
    }

    return LayerClass
  },

  addLayer (parentInstance, parentObject, sketchData) {

    if (!parentInstance.layers) return; 

    parentInstance.layers.forEach(layer => {

      var LayerClass = this.newOriginLayerClass(layer);
     
      if (layer._class === 'symbolInstance') {
        layer = {...this.symbols[layer.symbolID], ...layer};
      } 

      var layerJSON = {
        name: layer.name,
        id: 'id' + layer.do_objectID,
        ...SketchUtil.makeFrame(layer),
        ...SketchUtil.makeFill(layer),
        visible: layer.isVisible,
        lock: layer.isLock,
        ...SketchUtil.makePath(layer),
        transform: `rotate(${layer.rotation}deg)`
      }

      var child = parentObject.add(new LayerClass(layerJSON))

      this.addLayer(layer, child); 

    })
  },

  parse (sketchData) {
    var results = [] 
    this.symbols = {}
    this.sketchData = sketchData

    Object.keys(sketchData).filter(it => it.startsWith('pages/')).forEach(key => {
      var page = sketchData[key]

      var project = new Project({
        name: page.name
      });
  
      var artboards = page.layers;
  
      artboards.forEach(artboard => {
  
        if (artboard.symbolID) {
          this.symbols[artboard.symbolID] = artboard;
        }
  
        var artboardObject = project.add(new ArtBoard({
          name: artboard.name,
          ...SketchUtil.makeBackgroundColor(artboard),
          ...SketchUtil.makeFrame(artboard),
        }))
  
        this.addLayer(artboard, artboardObject);
        
      })

      results.push(project);
    })

    return results;
  }
}
