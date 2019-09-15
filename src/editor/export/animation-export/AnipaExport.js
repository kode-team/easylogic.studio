const SVG_PROPERTY_LIST = {
    'd': true,
    'points': true,
    'fill': true,
    'fill-opacity': true, 
    'stroke': true,
    'stroke-width': true,
    'stroke-dasharray': true,
    'stroke-dashoffset': true,
    'fill-rule': true,
    'stroke-linecap': true,
    'stroke-linejoin': true
}

const CSS_PROPERTY_LIST = {
    'position': true,
    'x': true,
    'y': true,
    'right': true,
    'bottom': true,
    'width': true,
    'height': true,
    'rootVariable': true,
    'variable': true,
    'transform': true,
    'filter': true,
    'backdrop-filter': true,
    'background-color': true,      
    'background-clip': true,
    'background-image': true,      
    'border-radius': true,      
    'box-shadow': true,
    'text-shadow': true,
    'text-clip': true,      
    'clip-path': true,
    'color': true,
    'font-size': true,
    'font-stretch': true,
    'line-height': true,
    'text-align': true,
    'text-transform': true,
    'text-decoration': true,
    'letter-spacing': true, 
    'word-spacing': true, 
    'text-indent': true,      
    'perspective-origin': true,
    'transform-origin': true,
    'transform-style': true,
    'perspective': true,
    'mix-blend-mode': true,
    'opacity': true,
    'rotate': true,    
    'text-fill-color': true,
    'text-stroke-color': true,
    'text-stroke-width': true,  
    'offset-path': true,
    'offset-distance': true,
    border: true,
    outline: true,
    borderRadius: true,
    borderImage: true,
    animations: true,
    transitions: true
}

const hasSVGProperty = (property) => {
    return SVG_PROPERTY_LIST[property] || false 
}

const hasCSSProperty = (property) => {
    return CSS_PROPERTY_LIST[property] || false 
}

const hasCustomProperty = (property) => {
    return hasSVGProperty(property) === false && hasCSSProperty(property) === false
}

const INTERPOLATE_TYPE = {
    'ColorViewEditor': 'color',
    'RangeEditor': 'length',
    'NumberRangeEditor': 'number',
    'RotateRangeEditor': 'rotate',
    'PathEditor': 'path',
    'TransformEditor': 'transform',
}

export default class AnipaExport {
    constructor (artboard) {
        this.artboard = artboard 
    }

    generateCode () {


        var lastTime = this.artboard.getSelectedTimelineLastTime();
        var timeline = this.artboard.getSelectedTimeline();
        var animations = [] 
        var options = {} 


        if (timeline) {
            timeline.animations.forEach (animation => {
                var item = this.artboard.searchById(animation.id);
                var properties = animation.properties.map(p => {
                    var property = p.property;

                    switch(property) {
                    case 'x': property = 'left'; break; 
                    case 'y': property = 'top'; break; 
                    }

                    return {
                        property,
                        keyframes: p.keyframes.map(keyframe => {
                            var { time, value, timing } = keyframe
                            return { time: time * 1000, value, timing }
                        })
                    };
                })


                animations.push(...item.toAnimationKeyframes(properties)) 

            })

            var { iterationCount, fps, speed, direction} = timeline
            var duration = lastTime * 1000; 

            options = { duration, iterationCount, fps, speed, direction }
        }

        animations = JSON.stringify(animations, null, 4);
        options = JSON.stringify(options,  null, 4);

        return `
var player = new anipa.Player(${animations}, ${options});
player.play();
`
    }
}
