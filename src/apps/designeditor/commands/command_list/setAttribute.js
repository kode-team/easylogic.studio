import { isFunction } from "sapa";

import { Layout } from "elf/editor/types/model";

export default {
  command: "setAttribute",
  /**
   *
   * @param {Editor} editor
   * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
   */
  execute: function (editor, multiAttrs = {}, context = { origin: "*" }) {
    const messages = [];

    Object.entries(multiAttrs).forEach(([id, attrs]) => {
      const item = editor.get(id);
      const newAttrs = {};

      Object.entries(attrs).forEach(([key, value]) => {
        newAttrs[key] = isFunction(value) ? value(item) : value;
      });

      messages.push({ id: item.id, parentId: item.parentId, attrs: newAttrs });
    });

    if (messages.length == 0) {
      return;
    }

    let hasRefreshCanvas = false;
    const children = [];
    // send message
    messages.forEach((message) => {
      const item = editor.get(message.id);

      // item 이 존재할 때
      if (item) {
        // 값을 바로 설정한다.
        item.reset(message.attrs, context);

        // [TIP]
        // 부모의 레이아웃이 바뀌면  자식을 먼저 렌더링 하고 부모를 렌더링 한다.
        if (item.hasChangedField("layout")) {
          item.layers.forEach((child) => {
            // 어떤 속성을 바꿔야 하는지 고민을 좀 해봐야할 듯
            // 지금은 따로 속성을바꾸지 않기 때문에 이전의 레이아웃 아이템 속성이 그대로 복원될거다.
            if (child.isLayout(Layout.DEFAULT)) {
              // grid, flex 속성 삭제
            } else if (child.isLayout(Layout.FLEX)) {
              // grid 속성 삭제
            } else if (child.isLayout(Layout.GRID)) {
              // flex 속성 삭제
            }

            editor.context.commands.emit("refreshElement", child);
          });
        }

        children.push(item);

        // 캔버스 갱신 여부를 지정한다.
        if (item.hasChangedHirachy) {
          hasRefreshCanvas = true;
        }
      }

      if (item.is("project")) {
        return;
      }

      if (item.parent && item.parent.is("project")) {
        return;
      }

      if (item.isLayoutItem() || item.isBooleanItem) {
        // 부모가 project 아닐 때만 업데이트 메세지를 날린다.
        const parent = editor.get(message.parentId);
        if (message.parentId && parent?.isNot("project")) {
          parent.reset({ changedChildren: true }, context);
          hasRefreshCanvas = true;
        }
      }
    });

    // 여러 객체를 동시에 렌더링 할 수 있어야 한다.
    if (children.length) {
      editor.context.commands.emit("refreshElement", children, false);
    }

    // canvas 를 재조정할일이 있으면 canvas 구조를 다시 그린다.
    if (hasRefreshCanvas) {
      editor.emit("refreshAllCanvas");
    }
  },
};
