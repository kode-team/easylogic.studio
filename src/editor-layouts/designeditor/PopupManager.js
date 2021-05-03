import "el/editor/ui/popup";  
import "el/editor/ui/window-list";
import "el/editor/ui/view/NotificationView";

import { registElement } from "el/base/registElement";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class PopupManager extends EditorElement {

  template() {
    return /*html*/`
      <div class="popup-manger">
        <object refClass='ColorPickerPopup' />
        <object refClass='BoxShadowPropertyPopup' />
        <object refClass='BackgroundImagePositionPopup' />
        <object refClass='TextShadowPropertyPopup' />
        <object refClass='AnimationPropertyPopup' />
        <object refClass='TransitionPropertyPopup' />
        <object refClass='KeyframePopup' />
        <object refClass='ClipPathPopup' />
        <object refClass='SVGPropertyPopup' />
        <object refClass='SelectorPopup' />
        <object refClass='ImageSelectPopup' />
        <object refClass='GradientPickerPopup' />
        <object refClass='FillPickerPopup' />
        <object refClass='PatternInfoPopup' />
        <object refClass='SVGFilterPopup' />
        <object refClass='ExportWindow' />
        <object refClass='ShortcutWindow' />
        <!-- LoginWindow / -->
        <!-- SignWindow / -->
        <!-- ImageFileView / -->
        <object refClass='NotificationView' />
      </div>
    `;
  }
}

registElement({ PopupManager })