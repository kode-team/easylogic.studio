import UIElement, { EVENT } from "@core/UIElement";
import { POINTERSTART, POINTERMOVE, POINTEREND, PREVENT } from "@core/Event";

export default class BaseBox extends UIElement {
  refresh() {}

  refreshColorUI(e) {}

  /** push change event  */
  changeColor(opt) {
    this.parent.changeColor(opt || {})
    this.emit('changeColor');
  }

  // Event Bindings
  [POINTEREND("document")](e) {
    if (this.isDown) {
      this.onDragEnd(e);
      this.isDown = false; 
    }

  }

  [POINTERMOVE("document")](e) {
    if (this.isDown) {
      this.onDragMove(e);
    }

  }

  [POINTERSTART("$bar")](e) {
    // e.preventDefault();
    this.isDown = true;
  }

  [POINTERSTART("$container")](e) {
    this.isDown = true;
    this.onDragStart(e);
  }

  onDragStart(e) {
    this.isDown = true;
    this.refreshColorUI(e);
  }

  onDragMove(e) {
    if (this.isDown) {
      this.refreshColorUI(e);
    }
  }

  /* called when mouse is ended move  */
  onDragEnd(e) {
    this.emit('lastUpdateColor');
    this.isDown = false;
  }

  [EVENT("changeColor", 'initColor')]() {
    this.refresh();
  }

}
