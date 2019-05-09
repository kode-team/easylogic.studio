import VerticalColorStep from "../ui/control/VerticalColorStep";
import CanvasView from "../ui/view/CanvasView";
import ToolMenu from "../ui/view/ToolMenu";

import { LOAD_START } from "../types/LoadTypes";
import UIElement, { EVENT } from "../../util/UIElement";
import { RESIZE, DEBOUNCE, IN, OUT, BIND } from "../../util/Event";
import { RESIZE_WINDOW } from "../types/ToolTypes";
import Inspector from "../ui/control/Inspector";
import FillPicker from "../ui/control/FillPicker";

import ColorPicker from "../ui/control/ColorPicker";
import ExportWindow from "../ui/window/ExportWindow";
import popup from "../ui/control/popup";

export default class CSSEditor extends UIElement {
  template() {
    return `
            <div class="layout-main -show-timeline" ref="$layoutMain">
                <div class="layout-header">
                    <div class="page-tab-menu"><ToolMenu /></div>
                </div>
                <div class="layout-middle">
                          
                    <div class="layout-right">
                        <Inspector />
                    </div>
                    <div class="layout-body">
                        <!-- LayerToolbar /-->
                        <CanvasView />
                        <VerticalColorStep />
                    </div>                              
                </div>
                <FillPicker />
                <ColorPicker  />
                <BackgroundPropertyPopup />
                <BoxShadowPropertyPopup />
                <ExportWindow />

            </div>
  
        `;
  }

  components() {
    return {
      ...popup,
      FillPicker,
      ColorPicker,
      Inspector,
      ToolMenu,
      VerticalColorStep,
      CanvasView,
      ExportWindow
    };
  }

  [EVENT(LOAD_START)](isAdd) {
    console.log("최초 로딩은 어디서 할까요?");
    // this.dispatch(STORAGE_LOAD, (isLoaded) => {
    //     if (!isLoaded && isAdd) {
    //         this.dispatch(ITEM_ADD_PAGE, true)
    //     } else {
    //         this.dispatch(ITEM_LOAD);
    //     }
    //     this.emit(CHANGE_ARTBOARD)
    // });
  }

  [BIND("$layoutMain")]() {
    return {
      value: this.state.xxx,
      style: `${this.state.xxx}`,
      class: `${this.state.class}`
    };
  }

  [RESIZE("window") + DEBOUNCE(100)](e) {
    this.emit(RESIZE_WINDOW);
  }
}
