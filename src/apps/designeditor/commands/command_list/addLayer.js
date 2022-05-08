import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function addLayer(
  editor,
  layer,
  isSelected = true,
  containerItem
) {
  if (!containerItem) {
    containerItem =
      editor.context.selection.current ||
      editor.context.selection.currentProject;
  }

  if (containerItem) {
    if (containerItem.isNot("project") && !containerItem.enableHasChildren()) {
      containerItem = containerItem.parent;
    }

    containerItem.appendChild(layer);

    if (isSelected) {
      editor.context.selection.select(layer);
    }

    _doForceRefreshSelection(editor);
  }
}
