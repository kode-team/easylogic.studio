import MenuItem from "./MenuItem";

export default class ExportView extends MenuItem {
  getIconString() {
    return "launch";
  }
  getTitle() {
    return this.$i18n("menu.item.export.title");
  }

  clickButton() {
    this.emit("showExportView");
  }
}
