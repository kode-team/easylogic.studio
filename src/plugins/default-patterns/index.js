import texture from './icons/texture';
import TextureView from './views/TextureView';
import { Editor } from 'el/editor/manager/Editor';
import CSSTextureView from './views/CSSTextureView';
import SVGTextureView from './views/SVGTextureView';

/**
 * 
 * @param {Editor} editor 
 */
 export default function (editor) {

    editor.registerElement({
        TextureView,
        CSSTextureView,
        SVGTextureView
    });    

    editor.registerUI('leftbar.tab', {
        TextureView: { 
            value: "texture",
            title: "Texture",
            icon: texture,
            designMode: ["design", "item"]
        }
    })

    editor.registerUI('leftbar.tab.texture', {
        TextureView
    })


}