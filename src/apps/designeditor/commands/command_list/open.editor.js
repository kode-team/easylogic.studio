import { ClipPath } from "elf/editor/property-parser/ClipPath";

export default {
  command: "open.editor",

  description: "Open custom editor for item  when doubleclick is fired",

  /**
   *
   * @param {Editor} editor
   * @param {object} pathObject
   * @param {string} pathObject.d    svg path 문자열
   */
  execute: function (editor, current) {
    if (!current && editor.context.selection.isOne === false) return;

    current = current || editor.context.selection.current;

    if (current) {
      // d 속성은 자동으로 페스 에디터로 연결
      if (current.editablePath) {
        editor.emit("showPathEditor", "modify", {
          box: "canvas",
          current,
          matrix: current.matrix,
          isControl: true,
          disableCurve: true,
          d: current.editablePath,
          changeEvent: (data) => {
            editor.context.commands.executeCommand(
              "setAttribute",
              "change editable path",
              editor.context.selection.packByValue(
                {
                  ...current.recoverEditablePath(data.d),
                },
                [current.id]
              )
            );

            editor.nextTick(() => {
              if (editor.context.stateManager.isPointerUp) {
                // boolean path 의 조정이 끝나면
                // box 를 재구성한다.
                editor.context.commands.emit("recoverBooleanPath");
              }
            });
          },
        });
        editor.emit("hideSelectionToolView");
      } else if (current.d) {
        editor.emit("showPathEditor", "modify", {
          box: "canvas",
          current,
          matrix: current.matrix,
          d: current.absolutePath().d,
          changeEvent: (data) => {
            const newCurrent = editor.context.selection.current;

            // .d 속성을 가진 것 중에 svg-path 가 아닌 것이 있는 상태로 변경되었을 경우
            // svg-path 로 바로 변환시켜준다.
            if (newCurrent.isSVG() && newCurrent.isNot("svg-path")) {
              const newPathData = newCurrent.toSVGPath();
              const newPath = editor.createModel({
                itemType: "svg-path",
                ...newPathData,
              });

              editor.context.selection.select(newPath);

              newCurrent.insertAfter(newPath);

              editor.nextTick(() => {
                editor.context.commands.emit("removeLayer", [newCurrent.id]);
                editor.context.commands.emit("updatePathItem", data);
              });
            } else {
              editor.context.commands.emit("updatePathItem", data);

              editor.nextTick(() => {
                if (editor.context.stateManager.isPointerUp) {
                  // boolean path 의 조정이 끝나면
                  // box 를 재구성한다.
                  editor.context.commands.emit("recoverBooleanPath");
                }
              });
            }
          },
        });
        editor.emit("hideSelectionToolView");
      } else if (current["clip-path"]) {
        var obj = ClipPath.parseStyle(current["clip-path"]);

        if (obj.type === "path") {
          var d = current.absolutePath(current.clipPathString).d;
          var mode = d ? "modify" : "path";

          editor.emit("showPathEditor", mode, {
            changeEvent: (data) => {
              const resultPath = current.invertPath(data.d).d;

              // d 속성 (path 문자열) 을 설정한다.
              editor.context.commands.executeCommand(
                "setAttribute",
                "change clip-path",
                editor.context.selection.packByValue({
                  "clip-path": `path(${resultPath})`,
                })
              );
            },
            current,
            d,
          });
          editor.emit("hideSelectionToolView");
        } else if (obj.type === "svg") {
          // NOOP
        } else {
          editor.emit("showClippathEditorView");
        }
      } else {
        // 기타 다른 에디터 연동하기
      }
    }
  },
};
