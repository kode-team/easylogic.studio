import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default function addLayer (editor, layer, rect = {}, isSelected = true, containerItem) {

    if (!containerItem) {
        containerItem = editor.selection.current || editor.selection.currentProject
    }

    if (containerItem) {

        if (!containerItem.is('project') && !containerItem.enableHasChildren()) {
            containerItem = containerItem.parent;
        }

        containerItem.appendChildItem(layer)

        if (isSelected) {
            editor.selection.select(layer);
        }

        _doForceRefreshSelection(editor,true, 10)
    }
}