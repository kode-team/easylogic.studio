import { os } from "elf/core/detect";

export const KEY_CODE = {
  backspace: 0x08, // 8
  tab: 0x09, // 9
  enter: 0x0d, // 13
  escape: 0x1b, // 27
  space: 0x20, // 32
  pageup: 0x21, // 33
  pagedown: 0x22, // 34
  end: 0x23, // 35
  home: 0x24, // 36
  left: 0x25, // 37
  up: 0x26, // 38
  right: 0x27, // 39
  down: 0x28, // 40
  insert: 0x2d, // 45
  delete: 0x2e, // 46

  0: 0x30, // 49
  1: 0x31, // 50
  2: 0x32, // 51
  3: 0x33, // 52
  4: 0x34, // 53
  5: 0x35, // 54
  6: 0x36, // 55
  7: 0x37, // 56
  8: 0x38, // 57
  9: 0x39, // 58

  semicolon: 0x3b, // 59
  equals: 0x3d, // 61

  a: 0x41, // 65
  b: 0x42, // 66
  c: 0x43, // 67
  d: 0x44, // 68
  e: 0x45, // 69
  f: 0x46, // 70
  g: 0x47, // 71
  h: 0x48, // 72
  i: 0x49, // 73
  j: 0x4a, // 74
  k: 0x4b, // 75
  l: 0x4c, // 76
  m: 0x4d, // 77
  n: 0x4e, // 78
  o: 0x4f, // 79
  p: 0x50, // 80
  q: 0x51, // 81
  r: 0x52, // 82
  s: 0x53, // 83
  t: 0x54, // 84
  u: 0x55, // 85
  v: 0x56, // 86
  w: 0x57, // 87
  x: 0x58, // 88
  y: 0x59, // 89
  z: 0x5a, // 90

  multiply: 0x6a, // 106 , *
  add: 0x6b, // 107 , "+"
  subtract: 0x6d, // 109 , "-"
  divide: 0x6f, // 111 , "/"

  f1: 0x70, // 112
  f2: 0x71, // 113
  f3: 0x72, // 114
  f4: 0x73, // 115
  f5: 0x74, // 116
  f6: 0x75, // 117
  f7: 0x76, // 118
  f8: 0x77, // 119
  f9: 0x78, // 120
  f10: 0x79, // 121
  f11: 0x7a, // 122
  f12: 0x7b, // 123
  f13: 0x7c, // 124
  f14: 0x7d, // 125
  f15: 0x7e, // 126
  f16: 0x7f, // 127
  f17: 0x80, // 128
  f18: 0x81, // 129
  f19: 0x82, // 130

  comma: 0xbc, // 188	Comma (",") key.
  ",": 0xbc, // 188	Comma (",") key.
  period: 0xbe, // 190	Period (".") key.
  ".": 0xbe, // 190	Period (".") key.
  slash: 0xbf, // 191	Slash ("/") key.
  "/": 0xbf, // 191	Slash ("/") key.
  backquote: 0xc0, // 192	Back tick ("`") key.
  "`": 0xc0, // 192	Back tick ("`") key.
  openbracket: 0xdb, // 219	Open square bracket ("[") key.
  "[": 0xdb, // 219	Open square bracket ("[") key.
  backslash: 0xdc, // 220	Back slash ("\") key.
  "\\": 0xdc, // 220	Back slash ("\") key.
  closebracket: 0xdd, // 221	Close square bracket ("]") key.
  "]": 0xdd, // 221	Close square bracket ("]") key.
  quote: 0xde, // 222	Quote (''') key.
  "'": 0xde, // 222	Quote (''') key.
  altgr: 0xe1, // 225	AltGr key (Level 3 Shift key or Level 5 Shift key) on Linux.
};

const keyAlias = {
  ARROWRIGHT: "→",
  ARROWLEFT: "←",
  ARROWUP: "↑",
  ARROWDOWN: "→",
  BACKSPACE: "⌫",
  CMD: "⌘",
  SHIFT: "⇧",
  CTRL: "⌃",
  ALT: "⌥",
  ENTER: "↵",
  ESC: "⎋",
  TAB: "⇥",
  SPACE: "␣",
  CAPSLOCK: "⇪",
  DELETE: "⌦",
  INSERT: "⌤",
  HOME: "⇱",
  END: "⇲",
  PAGEUP: "⇞",
  PAGEDOWN: "⇟",
  PRINTSCREEN: "⎙",
  SCROLLLOCK: "⇞",
  PAUSE: "⏏",
  NUMLOCK: "⇪",
  META: "⌘",
  WINDOWS: "⌘",
  CONTEXTMENU: "⌥",
  COMMAND: "⌘",
};

const OSName = os();

export const KeyStringMaker = (item, os = OSName) => {
  return (item[os] || item.key)
    .split("+")
    .map((it) => it.trim())
    .map((it) => {
      const keyString = it.toUpperCase();
      return keyAlias[keyString] || keyString;
    })
    .join(" ");
};
