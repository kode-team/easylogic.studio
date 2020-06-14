import { Length } from "../unit/Length";

export default function loadOriginalVideo(obj, callback) {
    var video = document.createElement('video');
    video.onloadeddata = () => {

        var info = {
            local: obj.local,
            naturalWidth: Length.px(video.videoWidth),
            naturalHeight: Length.px(video.videoHeight), 
            width: Length.px(video.videoWidth),
            height: Length.px(video.videoHeight),
            duration: video.duration,
            playTime: `0:1:${video.duration}`,
            volume: video.volume,
            muted: video.muted,
            placebackRate: video.playbackRate
        }

        callback && callback(info, video);
    }

    video.src = obj.local; 
}