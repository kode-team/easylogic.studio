import { Length } from "elf/editor/unit/Length";

export default class BorderRadius {
  static parseStyle(str = "") {
    var obj = {
      isAll: true,
      "border-radius": 0,
      "border-top-left-radius": 0,
      "border-top-right-radius": 0,
      "border-bottom-right-radius": 0,
      "border-bottom-left-radius": 0,
    };

    var arr = str.split(" ").map((it) => Length.parse(it));

    if (arr.length === 1) {
      obj.isAll = true;
      obj["border-radius"] = arr[0];
    } else {
      obj.isAll = false;
      obj["border-top-left-radius"] = arr[0];
      obj["border-top-right-radius"] = arr[1];
      obj["border-bottom-right-radius"] = arr[2];
      obj["border-bottom-left-radius"] = arr[3];

      // 모두 같은 속성이면 하나로 처리할 수 있도록 한다.
      if (
        arr[0].equals(arr[1]) &&
        arr[0].equals(arr[2]) &&
        arr[0].equals(arr[3])
      ) {
        obj.isAll = true;
        obj["border-radius"] = arr[0];
      }
    }

    return obj;
  }
}
