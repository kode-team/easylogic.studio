export function makeInterpolatePlayTime(layer, property, startValue, endValue, artboard, layerElement) {

    // media 플레이에 필요한 것 
    // 시작 시점(startTime), 끝나는 시점 (endTime);
    // 시점에 따른 playbackRate 자동 계산 
    // 단순 seek 는 움직임을 보여주지 않음. 이상하게 보일 수도 있으니 참고 

    const mediaElement = layerElement.$('video').el;
    let [sTime, eTime] = layer.playTime.split(":"); 

    const duration = mediaElement.duration;

    const startTime = +(sTime || 0) * duration;
    const endTime = +(eTime || 1) * duration;
    const maxTime = Math.abs(endTime - startTime); 

    return (rate, t, totalT) => {
        if (t === 0) {
            mediaElement.currentTime = startTime; 
            mediaElement.playbackRate = maxTime /  totalT ; 
            mediaElement.play(); 
        } else if (t === 1) {
            mediaElement.pause();
        } else {
        
        }
    }
}
