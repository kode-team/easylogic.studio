export default function loadOriginalVideo(obj, callback) {
  var video = document.createElement("video");
  video.onloadeddata = () => {
    var info = {
      local: obj.local,
      naturalWidth: video.videoWidth,
      naturalHeight: video.videoHeight,
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
      playTime: `0:1:${video.duration}`,
      volume: video.volume,
      muted: video.muted,
      placebackRate: video.playbackRate,
    };

    callback && callback(info, video);
  };

  video.src = obj.local;
}
