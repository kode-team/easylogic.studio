export default {
  command: "history.copyLayer",
  description: "copy in selected items ",
  description_ko: ["선택된 아이템을 기준으로 복제한다. "],
  execute: async function (editor, ids = []) {
    // copy 일 경우 히스토리 적용방법
    // 1. data 에서 ids 를 가져온다.
    // 2. ids 를 기준으로 item 의 data 를 만든다. (이때 json renderer 를 사용한다.)
    // 2.1 json renderer 로 생성된 객체는 world 좌표만 가진다.
    // 3. editor.createModel(data) 을 통해 새로운 item 을 생성한다.
    // 4. 10, 10 을 absolute 기준으로 이동한다.
    // 5. model 을 부모에 추가한다.
    // 6. 부모 정보를 수집한다.
    // 7. 부모의 children 의 변경점을 수집한다.
    // 8. 자식,부모 정보를 setAttribute 로 업데이트 한다.
    // 9. history 에 추가한다.

    let currentIds = ids
      .map((id) => editor.get(id))
      .filter(Boolean)
      .map((item) => item.id);

    if (!currentIds.length) {
      currentIds = editor.context.selection.ids;
    }

    if (!currentIds.length) return;

    // 1. copy 리스트 구하기
    const items = await editor.json.renderAll(
      currentIds.map((it) => editor.get(it))
    );

    const newIds = [];

    const itemList = {};
    const parentList = {};

    let updateData = {};

    // 2. 개별 모델 생성하기
    items.forEach((itemJSON) => {
      // copy 레퍼런스 구하기
      const referenceId = itemJSON.referenceId;
      const sourceItem = editor.get(referenceId);

      // 부모 정보 구하기
      parentList[sourceItem.parentId] = sourceItem.parent;

      // copy 레퍼런스가 있으면 그것을 기준으로 새로운 레퍼런스 생성하기
      const model = editor.createModel(itemJSON);

      // 동일한 이름이 존재하면 이름 바꾸기
      model.renameWithCount();

      // 현재 source 의 다음으로 추가
      sourceItem.insertAfter(model);

      // 최종 생성된 model 의 id 를 수집하기
      newIds.push(model.id);

      // 모든 정보를 가지고 오기
      itemList[model.id] = itemJSON;
      updateData[model.id] = model.toCloneObject();
    });

    // 부모 변경 상태 저장
    Object.values(parentList).forEach((parent) => {
      updateData = {
        ...updateData,
        ...parent.attrsWithId("children"),
      };
    });

    // history, 추가에 대한 newIds 를  저장하고, undo 할 때는 newIds 를 삭제해준다.
    // 수집된 커맨드 동시에 실행
    editor.context.commands.emit("setAttribute", updateData);

    editor.nextTick(() => {
      // 새로 생성된 model 의 id 를 선택하기
      editor.context.selection.select(...newIds);
    });
  },
};
