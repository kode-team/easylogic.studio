const UUID_REG = /[xy]/g;

export function uuid() {
  var dt = new Date().getTime();
  var uuid = "xxx12-xx-34xx".replace(UUID_REG, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export function uuidShort() {
  var dt = new Date().getTime();
  var uuid = "idxxxxxxx".replace(UUID_REG, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
