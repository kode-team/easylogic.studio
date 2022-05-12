import { vertiesToRectangle } from "elf/core/collision";
export default {
  command: "convert.no.transform.path",
  description:
    "remove transform(rotate, translate, scale) inforation in path layer",
  execute: (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    // 1. world position 기준으로 path 를 구한다.
    // 2. 부모를 기준으로 invert 를 해줘서 새로운 로컬 path를 구하고 그걸 기반으로  bbox를 구해서 새롭게 구성한다.
    // 3. 새로운 로컬 path를 기반으로 새로운 layer를 생성한다.
    const parent = current.parent;
    const childPath = current.absolutePath();

    if (parent.is("project")) {
      const verties = childPath.getBBox();
      const newRect = vertiesToRectangle(verties);

      editor.context.commands.executeCommand(
        "setAttribute",
        "remove transform for path",
        editor.context.selection.packByValue({
          ...newRect,
          rotate: 0,
          d: childPath.d,
        })
      );
    } else {
      // 상위 컴포넌트가 project 이면
      // 현재는 어디 소속된 곳이 아니기 때문에
      // world 좌표로 바로 적용한다.

      childPath.transformMat4(parent.absoluteMatrixInverse);
      const newRect = parent.updatePath(childPath.d);

      editor.context.commands.executeCommand(
        "setAttribute",
        "remove transform for path",
        editor.context.selection.packByValue({
          ...newRect,
          rotate: 0,
          d: childPath.d,
        })
      );
    }
  },
};
