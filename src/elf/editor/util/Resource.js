export default class Resource {
  static getAllDropItems(e) {
    var items = [];

    if (e.dataTransfer) {
      items = [...e.dataTransfer.types]
        .map((type) => {
          if (type.includes("text")) {
            return {
              kind: "string",
              type,
              data: e.dataTransfer.getData(type),
            };
          }
        })
        .filter((it) => it);
    }

    var files = [];

    if (e.dataTransfer) {
      files = [...e.dataTransfer.files];
    }

    return [...items, ...files];
  }
}

export const filter_list = [
  "blur",
  "grayscale",
  "hue-rotate",
  "invert",
  "brightness",
  "contrast",
  "drop-shadow",
  "opacity",
  "saturate",
  "sepia",
  "svg",
];
