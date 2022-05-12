import { ViewModeType } from "elf/editor/types/editor";
export class ModeViewManager {
  constructor(editor) {
    this.editor = editor;
    this.modes = [ViewModeType.CanvasView];
  }

  pushMode(mode) {
    if (!this.isCurrentMode(mode)) {
      this.modes.push(mode);
    }
  }

  popMode(mode = undefined) {
    if (mode) {
      if (this.isCurrentMode(mode)) {
        this.modes.pop();
      }
    } else {
      this.modes.pop();
    }
  }

  currentMode() {
    return this.modes[this.modes.length - 1];
  }

  isCurrentMode(mode) {
    return this.currentMode() === mode;
  }
}
