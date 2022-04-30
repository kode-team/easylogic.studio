export class StateManager {
  /**
   *
   * @param {Editor} editor
   */
  constructor(editor) {
    this.editor = editor;
  }

  get config() {
    return this.editor.context.config;
  }

  // 팝업의 zindex 를 계속 높여 주어
  // 최근에 열린 팝업이 밑으로 가지 않게 한다.
  get zIndex() {
    return this.popupZIndex++;
  }

  /**
   * 현재 Mouse Up 상태인지 체크
   *
   * @returns {boolean}
   */
  get isPointerUp() {
    const e = this.config.get("bodyEvent");
    if (!e) return true;

    if (e.type === "pointerup") return true;
    else if (e.type === "pointermove" && e.buttons === 0) return true;

    return false;
  }

  get isPointerDown() {
    return !this.isPointerUp;
  }

  get isPointerMove() {
    if (!this.config.get("bodyEvent")) return false;
    return this.config.get("bodyEvent").type === "pointermove";
  }
}
