export class AssetParser {
  static parse(datauri, enableParselocal = false) {
    var [, data] = datauri.split("data:");
    var [mediaType, ...content] = data.split(",");
    var [mimeType, encoding] = mediaType.split(";");

    content = content.join(",");

    return {
      mimeType,
      local:
        enableParselocal && AssetParser.getLink(mimeType, encoding, content),
    };
  }

  static getLink(mimeType, encoding, content) {
    if (encoding === "base64") {
      var binary = window.atob(content);
      var len = binary.length;
      var unit8Array = new window.Uint8Array(len);

      for (var i = 0; i < len; i++) {
        unit8Array[i] = binary.charCodeAt(i);
      }

      var blob = new window.Blob([unit8Array], { type: mimeType });

      return window.URL.createObjectURL(blob);
    }

    return "";
  }
}
