import { Length } from "@unit/Length";

export default function loadOriginalImage(obj, callback) {
    var img = new Image();
    img.onload = () => {

        var info = {
            id: obj.id,
            local: obj.local,
            naturalWidth: Length.px(img.naturalWidth),
            naturalHeight: Length.px(img.naturalHeight), 
            width: Length.px(img.naturalWidth),
            height: Length.px(img.naturalHeight)
        }

        callback && callback(info, img);
    }
    img.src = obj.local; 
}