import { isFunction } from "sapa";
import icon from "elf/editor/icon/icon";

export class CursorManager {
  async load(iconName = "default", ...args) {
    if (icon[iconName]) {
      const iconContent = isFunction(icon[iconName])
        ? icon[iconName].call(icon[iconName], ...args)
        : icon[iconName];
      const blob = new window.Blob([iconContent], { type: "image/svg+xml" });

      return new Promise((resolve) => {
        const reader = new window.FileReader();
        reader.onload = (e) => {
          const datauri = e.target.result;
          resolve(`url(${datauri}) 12 12, auto`);
        };
        reader.readAsDataURL(blob);
      });
    } else {
      return iconName;
    }
  }
}
