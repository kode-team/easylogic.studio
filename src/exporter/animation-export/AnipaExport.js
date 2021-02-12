export default class AnipaExport {
    constructor (project, artboard) {
        this.project = project 
        this.artboard = artboard 
    }

    generateCode () {

        var lastTime = this.project.getSelectedTimelineLastTime();
        var timeline = this.project.getSelectedTimeline();
        var animations = [] 
        var options = {} 


        if (timeline) {
            timeline.animations.forEach (animation => {
                var item = this.project.searchById(animation.id);

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

                animations.push.apply(animations, item.toAnimationKeyframes(properties).filter(it => {
                    return it.properties.length
                })) 

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
