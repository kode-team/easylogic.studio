import _doForceRefreshSelection from "./_doForceRefreshSelection";
/**
 *
 * @param {Editor} editor
 * @param {*} obj
 * @param {vec3} [center=null] center를 지정하고 artboard 를 재배치
 */
export default function addCustomComponent(editor, obj = {}, center = null) {
  var project = editor.context.selection.currentProject;

  var customComponent = project.appendChild(
    editor.createModel({
      x: 300,
      y: 200,
      width: 375,
      height: 667,
      ...obj,
    })
  );

  if (center) {
    customComponent.reset({
      x: 0,
      y: 0,
    });
    customComponent.moveByCenter(center);
  }

  editor.context.selection.select(customComponent);

  _doForceRefreshSelection(editor);
}
