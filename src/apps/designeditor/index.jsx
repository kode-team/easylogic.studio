import "./layout.scss";
import { ClipboardManager } from "./managers/ClipboardManager";
import { HistoryManager } from "./managers/HistoryManager";
import { LockManager } from "./managers/LockManager";
import { ModelManager } from "./managers/ModelManager";
import { PathKitManager } from "./managers/PathKitManager";
import { SegmentSelectionManager } from "./managers/SegmentSelectionManager";
import { SelectionManager } from "./managers/SelectionManager";
import { SnapManager } from "./managers/SnapManager";
import { TimelineSelectionManager } from "./managers/TimelineSelectionManager";
import { VisibleManager } from "./managers/VisibleManager";
import designEditorPlugins from "./plugins/design-editor-plugins";

import { BlankEditor } from "apps/blankeditor";
import BodyPanel from "apps/common/BodyPanel";
import { DefaultLayoutItem } from "apps/common/layout/DefaultLayout";

export class DesignEditor extends BlankEditor {
  initialize() {
    super.initialize();

    this.$context.pathkit.load();
  }

  afterRender() {
    super.afterRender();

    // load default data
    this.$commands.emit("load.json", this.opt.data);

    this.$config.init(
      "editor.layout.elements",
      this.children.$layout.getLayoutElements()
    );
  }

  getManagers() {
    return {
      snapManager: SnapManager,
      selection: SelectionManager,
      segmentSelection: SegmentSelectionManager,
      timeline: TimelineSelectionManager,
      history: HistoryManager,
      modelManager: ModelManager,
      lockManager: LockManager,
      visibleManager: VisibleManager,
      clipboard: ClipboardManager,
      pathkit: PathKitManager,
    };
  }

  /**
   *
   * @protected
   * @returns {function[]}
   */
  getPlugins() {
    return designEditorPlugins;
  }

  /**
   * body panel 영역 재정의
   *
   * @protected
   * @override
   */
  getBodyPanel() {
    return (
      <DefaultLayoutItem type="body">
        <BodyPanel ref={"$bodyPanelView"} />
      </DefaultLayoutItem>
    );
  }
}
