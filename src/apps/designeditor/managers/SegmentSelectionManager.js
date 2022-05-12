export class SegmentSelectionManager {
  constructor(editor) {
    /**
     * @property {Editor} $editor Editor
     */
    this.$editor = editor;

    this.selectedPointKeys = {};
    this.selectedPointList = [];
  }

  get length() {
    return this.selectedPointList.length;
  }

  initialize() {
    this.selectedPointKeys = {};
    this.selectedPointList = [];
  }

  makeSegmentKey(index, key) {
    return `${index}_${key}`;
  }

  select(...list) {
    this.selectedPointKeys = {};
    this.selectedPointList = list.map(({ key, index }) => ({
      key,
      index: +index || 0,
    }));
    list.forEach((it) => {
      var key = this.makeSegmentKey(it.index, it.key);
      this.selectedPointKeys[key] = it;
    });
  }

  /**
   * index, key에 해당하는 segment 의 selection 을 토글한다.
   *
   * @param {number} index
   * @param {"startPoint"|"endPoint"|"reversePoint"} key
   */
  toggleSegment(index, key) {
    // 선택된게 아니면 추가
    if (!this.isSelectedSegment(key, index)) {
      this.select(...this.selectedPointList, { key, index });
    } else {
      // 이미 선택되어 있다면 해제
      this.select(
        ...this.selectedPointList.filter((it) => {
          return it.key !== key || it.index !== index;
        })
      );
    }
  }

  toggleSelect(...list) {
    // 선택된 포인트는 해제, 다른 포인트는 추가
    list = list.map((it) => {
      return { ...it, included: this.isSelectedSegment(it.index, it.key) };
    });

    // included list 는 삭제
    const includedList = list.filter((it) => it.included);

    // not included list 는 추가
    const notIncludedList = list.filter((it) => !it.included);

    let uniqueList = [...this.selectedPointList];

    // 선택된 포인트는 해제
    if (includedList.length) {
      uniqueList = this.selectedPointList.filter((it) => {
        const oldKey = this.makeSegmentKey(it);

        return (
          Boolean(
            includedList.find((includeNode) => {
              return oldKey === this.makeSegmentKey(includeNode);
            })
          ) === false
        );
      });
    }

    this.select(...uniqueList, ...notIncludedList);
  }

  /**
   *
   * segment 를 선택한다.
   *
   * @param {number} index
   * @param {"startPoint"|"endPoint"|"reversePoint"} key
   */
  selectKeyIndex(index, key) {
    if (!this.isSelectedSegment(index, key)) {
      this.select({ key, index });
    }
  }

  isSelectedSegment(index, key) {
    var key = this.makeSegmentKey(index, key);
    return !!this.selectedPointKeys[key];
  }
}
