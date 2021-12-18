
import PathParser from 'el/editor/parser/PathParser';
export default {
    command: 'convert.flatten.path',
    description: 'flatten selected multi path',
    execute: (editor) => {
        const current = editor.selection.current;

        if (!current) return;

        let newPath;

        if (current.isBooleanPath || current.isBooleanItem) {
          let parent = current;
          if (current.isBooleanItem) {
            parent = current.parent;
          }

          newPath = parent.accumulatedPath(parent['boolean-path']);
          newPath = parent.invertPath(newPath.d);

          const newLayerAttrs = parent.layers[0].toCloneObject();
          delete newLayerAttrs.id;
          delete newLayerAttrs.parentId;
          delete newLayerAttrs.transform;
    
          editor.command('addLayer', `add layer - path`, editor.createModel({
            ...newLayerAttrs,
            ...parent.updatePath(newPath.d),
          }), true, parent.parent)            
        } else {

          newPath = PathParser.fromSVGString();
          editor.selection.each((item) => {
            newPath.addPath(item.accumulatedPath());
          });
    
          newPath = current.invertPath(newPath.d);
          const parent = current.parent;
          const newPathInfo = current.updatePath(newPath.d)

          const newLayerAttrs = current.toCloneObject();
          delete newLayerAttrs.id;



          editor.command("removeLayer", "remove selected layers");
          editor.nextTick(() => {
            editor.command('addLayer', `add layer - path`, editor.createModel({
              ...newLayerAttrs,
              ...newPathInfo,
            }), true, parent)          
          });

    

        }


    }
}