export class HistoryManager {
  constructor(editor) {
    this.$editor = editor;
    this.$context = editor.context;

    this.currentIndex = -1;
    this.undoHistories = [];
    this.redoHistories = [];
    this.selection = {};
  }

  get length() {
    return this.undoHistories.length;
  }

  get selectedIds() {
    return Object.keys(this.selection);
  }

  createCommand(commandString) {
    return this.$context.stateManager.isPointerUp
      ? `history.${commandString}`
      : commandString;
  }

  // eslint-disable-next-line no-unused-vars
  saveSelection(obj = {}) {
    this.selection = this.$editor.context.selection.toCloneObject();
  }

  getUndoValues(multiAttrs = {}) {
    let result = {};

    Object.keys(multiAttrs).forEach((id) => {
      result[id] = {};

      const selectedObject =
        this.selection[id] || this.$editor.context.selection.itemsByIds(id)[0];
      const attrs = multiAttrs[id];

      Object.keys(attrs).forEach((key) => {
        result[id][key] = selectedObject[key];
      });
    });

    return result;
  }

  /**
   *
   * @param {string} message
   * @param {CommandObject} command
   * @param {{currentValues: any, undoValues: any, redoValues: any}} data
   */
  add(message, command, data) {
    const time = window.performance.now();
    const lastUndoObject = this.undoHistories[this.undoHistories.length - 1];
    const historyObject = { message, command, data, time };

    if (
      lastUndoObject &&
      lastUndoObject.message === message &&
      time - lastUndoObject.time <
        this.$editor.context.config.get("history.delay.ms")
    ) {
      // 같은 메시지를 입력한 경우
      // 이전 history 와 현재 히스토리 등록 시간의 차이가 1초 미만일 때
      // 마지막 메세지로 대체한다.
      this.undoHistories[this.undoHistories.length - 1] = historyObject;
    } else {
      this.undoHistories.push(historyObject);
      this.currentIndex++;
      this.undoHistories.length = this.currentIndex + 1;
    }

    this.$context.commands.emit("refreshHistory", command.command);
    this.$editor.emit("refreshHistoryList");

    return historyObject;
  }

  /**
   * undo, redo 히스토리 리스트를 만든다.
   *
   * @param {Function} callback
   */
  map(callback) {
    let results = [
      ...this.undoHistories.map(callback),
      "-",
      ...this.redoHistories.map(callback),
    ].reverse();

    return results;
  }

  /**
   * undo 를 수행한다.
   */
  undo() {
    if (this.currentIndex < -1) return;

    if (this.currentIndex === this.length) {
      this.currentIndex--;
    }

    const commandObject = this.undoHistories[this.currentIndex];

    if (commandObject && commandObject.command) {
      // undo 실행
      commandObject.command.undo(this.$editor, commandObject.data);

      // 이전 index 로 이동
      this.currentIndex--;
      // this.redoHistories.unshift(commandObject);
      this.$editor.nextTick(() => {
        this.$context.commands.emit("refreshHistory", commandObject.command);
        this.$editor.emit("refreshHistoryList");
      });
    }
  }

  /**
   * redo를 수행한다.
   */
  redo() {
    if (this.currentIndex > this.length) return;

    // currentIndex 가 -1 부터 시작하기 때문에 ++this.currentIndex 로 index 를 하나 올리고 시작한다.
    if (this.currentIndex < 0) {
      this.currentIndex++;
    }
    const commandObject = this.undoHistories[this.currentIndex];

    if (commandObject && commandObject.command) {
      // 현재 위치 command redo 실행 후 index 다음 커맨드로 맞추기
      // [5] 번 command 가 redo 가 된 후 [6] 을 redo 할 수 있도록 index 를 맞춘다.
      this.currentIndex++;

      commandObject.command.redo(this.$editor, commandObject.data);
      this.$editor.debug(commandObject);

      this.$editor.nextTick(() => {
        this.$context.commands.emit("refreshHistory", commandObject.command);
        this.$editor.emit("refreshHistoryList");
      });
    }
  }
}
