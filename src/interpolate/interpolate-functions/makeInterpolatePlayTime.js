export function makeInterpolatePlayTime(layer, property, startValue, endValue, artboard, layerElement) {

    // media 플레이에 필요한 것 
    // 시작 시점(startTime), 끝나는 시점 (endTime);
    // 시점에 따른 playbackRate 자동 계산 
    // 단순 seek 는 움직임을 보여주지 않음. 이상하게 보일 수도 있으니 참고 

    const mediaElement = layerElement.$('video').el;

    let [sTime, eTime, durationTime] = startValue.split(":"); 

    const duration = +(durationTime || 1);
    const startTime = +(sTime || 0) * duration;

    return (rate, t) => {
        if (t === 0) {
            mediaElement.currentTime = startTime; 
            if (mediaElement.paused) {
                mediaElement.play(); 
            }
        } else if (t === 1) {
            layer.reset({
                currentTime: mediaElement.currentTime,
            })            
            mediaElement.pause();
        } else {
            if (mediaElement.paused) {
                mediaElement.play(); 
            }
        }
    }
}
