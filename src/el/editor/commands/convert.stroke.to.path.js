
import { Length } from 'el/editor/unit/Length';
export default {
    command: 'convert.stroke.to.path',
    execute: async (editor, text) => {
        const current = editor.selection.current;

        if (!current) return;

        const attrs = current.attrs('d', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linejoin', 'stroke-linecap');
        const pathAttrs = current.convertStrokeToPath()
  
        const newD = editor.pathKitManager.stroke(current.d || attrs.d, {
          'stroke-width': Length.parse(attrs['stroke-width']).value,
          'stroke-linejoin': attrs['stroke-linejoin'],
          'stroke-linecap': attrs['stroke-linecap'],
          'stroke-dasharray': attrs['stroke-dasharray'],
          'stroke-dashoffset': attrs['stroke-dashoffset'],        
          'fill-rule': 'nonezero',
        });
  
        pathAttrs['fill-rule'] = 'nonzero';
  
  
        editor.command('addLayer', `add layer - path`, editor.createModel({
          ...pathAttrs,
          ...current.updatePath(newD),
        }), true, current.parent)      
    }
}