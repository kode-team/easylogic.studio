export default {
  command: "recoverBooleanPath",
  description: "recover box rectangle for boolean path result",
  /**
   *
   * @param {Editor} editor
   * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
   */
  execute: function (editor) {
    const current = editor.context.selection.current;

    let booleanContainer;
    if (current && current.isBooleanItem) {
      booleanContainer = current.parent;
    } else if (current && current.is("boolean-path")) {
      booleanContainer = current;
    }

    if (booleanContainer) {
      const isBooleanItem =
        typeof current.isBooleanItem === "boolean" && current.isBooleanItem;
      const booleanPath = booleanContainer.d;

      // 아무것도 생성하지 않았으면 종료
      if (!booleanPath) {
        return;
      }

      // 하위 객체 위치 캐싱
      const layersCache = booleanContainer.layers.map((it) => {
        return {
          item: it,
          matrix: it.matrix,
        };
      });

      // booleanPath 는 booleanContainer 의 로컬 좌표이기 때문에
      // updatePath 를 사용해서 새로운 booleanContainerRect 를 구할 수 있도록 한다.
      const newBooleanContainerRect = booleanContainer.updatePath(booleanPath);

      // booleanContainer 의 x, y, width, height 를 바꿈
      delete newBooleanContainerRect.d;

      // rect 정보를 먼저 업데이트 하고 이후에 캐쉬된 layer 들의 matrix 를 업데이트 한다.
      booleanContainer.reset(newBooleanContainerRect);

      // 여기까지 하면 container 의 위치는 맞춰줬는데 , 아래에 있는 아이템들은 위치를 바꿔줘야 함
      // 부모의 rect 를 기준으로 자식의 위치를 변경한다.
      layersCache.forEach((it) => {
        booleanContainer.resetMatrix(it.item);
      });

      // 모든 값이 업데이트 되면 현재 값을 history 에 저장한다.
      // FIXME: booleanContainer 가 마지막에 변경이 되어야 최종 크기를 결정할 수 있다.
      const ids = [...layersCache.map((it) => it.item.id), booleanContainer.id];
      const data = editor.context.selection.packByIds(
        ids,
        "x",
        "y",
        "width",
        "height"
      );

      // booleanItem, 즉 자식이 그냥 변경되는 경우
      // 부모는 자식을 기준으로 변경사항만 적용하고
      editor.context.commands.executeCommand(
        "setAttribute",
        "fit boolean path",
        data,
        {
          origin: "*",
          doNotChildrenScale: isBooleanItem,
        }
      );

      // // 1. boolean 결과값을 구한다.
      // //   1. boolean path 와
      // //   2. 하위 객체들의 좌표를
      // //   3. 모두 world position 기준으로 바꾸고
      // // 2. boolean 결과값을로 부모의 rect 를 변경한다.
      // // 4. selection 을 그대로 유지한다.
    }
  },
};
