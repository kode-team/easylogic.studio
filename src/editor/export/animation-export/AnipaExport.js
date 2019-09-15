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


const hasSVGProperty = (property) => {
    return SVG_PROPERTY_LIST[property] || false 
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

                var properties = animation.properties.map(p => {
                    var property = p.property;

                    switch(property) {
                    case 'x': property = 'left'; break; 
                    case 'y': property = 'top'; break; 
                    }

                    return {
                        property,
                        keyframes: p.keyframes.map(keyframe => {
                            var { time, value, timing} = keyframe
                            return { time: time * 1000, value, timing }
                        })
                    };
                })

                var svgProperties = properties.filter(it => hasSVGProperty(it.property));
                var cssProperties = properties.filter(it => hasSVGProperty(it.property) === false);

                if (svgProperties.length) animations.push({ properties: svgProperties, selector: `[data-id="${animation.id}"] > *` });
                if (cssProperties.length) animations.push({ properties: cssProperties, selector: `[data-id="${animation.id}"]` });
                
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
