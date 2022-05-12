export default function loadOriginalImage(obj, callback) {
  var img = new window.Image();
  img.onload = () => {
    var info = {
      id: obj.id,
      local: obj.local,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      width: img.naturalWidth,
      height: img.naturalHeight,
    };

    callback && callback(info, img);
  };
  img.onerror = (e) => {
    console.log(e, e.message);
  };
  img.src = obj.local;
}
