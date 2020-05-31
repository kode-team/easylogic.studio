import { Length } from "../unit/Length";

export default function loadOriginalVideo(obj, callback) {
    var video = document.createElement('video');
    video.onloadeddata = () => {

        var info = {
            local: obj.local,
            naturalWidth: Length.px(video.videoWidth),
            naturalHeight: Length.px(video.videoHeight), 
            width: Length.px(video.videoWidth),
            height: Length.px(video.videoHeight)
        }

        callback && callback(info, video);
    }
    video.src = obj.local; 
}