export function makeInterpolatePlay(layer, property, startValue, endValue, artboard, layerElement) {

    // media 플레이에 필요한 것 
    // 시작 시점(startTime), 끝나는 시점 (endTime);
    // 시점에 따른 playbackRate 자동 계산 
    // 단순 seek 는 움직임을 보여주지 않음. 이상하게 보일 수도 있으니 참고 

    const medialElement = layerElement.el;
    const startTime = layer.currentTime; 
    const endTime = medialElement.duration;

    const maxTime = Math.abs(endTime - startTime); 

    return (rate, t, totalT) => {
        if (t === 0) {
            medialElement.currentTime = startTime; 
            medialElement.playbackRate = maxTime /  totalT ; 
            medialElement.play(); 
        } else if (t === 1) {
            medialElement.pause();
        } else {
        
        }
    }
}
