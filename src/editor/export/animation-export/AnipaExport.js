

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
