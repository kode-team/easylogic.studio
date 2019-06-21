export function CSS_TO_STRING(style) {
  var newStyle = style;

  return Object.keys(newStyle)
    .filter(key => {
      return !!newStyle[key];
    })
    .map(key => {
      return `${key}: ${newStyle[key]}`;
    })
    .join(";");
}
