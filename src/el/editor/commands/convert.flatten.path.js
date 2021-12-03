
import PathParser from 'el/editor/parser/PathParser';
export default {
    command: 'convert.flatten.path',
    description: 'flatten selected multi path',
    execute: (editor) => {
        const current = editor.selection.current;

        if (!current) return;

        let newPath;

        if (current.isBooleanPath) {
          newPath = current.accumulatedPath(current['boolean-path']);
          newPath = current.invertPath(newPath.d);

          const newLayerAttrs = current.layers[0].toCloneObject();
          delete newLayerAttrs.id;
          delete newLayerAttrs.parentId;
    
          editor.command('addLayer', `add layer - path`, editor.createModel({
            ...newLayerAttrs,
            ...current.updatePath(newPath.d),
          }), true, current.parent)            
        } else {

          newPath = PathParser.fromSVGString();
          editor.selection.each((item) => {
            newPath.addPath(item.accumulatedPath());
          });
    
          newPath = current.invertPath(newPath.d);


          const newLayerAttrs = current.toCloneObject();
          delete newLayerAttrs.id;
    
          editor.command('addLayer', `add layer - path`, editor.createModel({
            ...newLayerAttrs,
            ...current.updatePath(newPath.d),
          }), true, current.parent)          
        }


    }
}