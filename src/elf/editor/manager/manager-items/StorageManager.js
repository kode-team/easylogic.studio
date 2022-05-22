import { uuid } from "elf/core/math";

/**
 * localStorage Manager
 *
 * @class StorageManager
 */
export class StorageManager {
  constructor(editor) {
    this.editor = editor;

    this.customAssetKey = "custom-assets";
  }

  async getCustomAssetList() {
    let isNew = false;
    const artboards = (this.editor.loadItem(this.customAssetKey) || []).map(
      (it) => {
        if (!it.id) {
          it.id = uuid();
          isNew = true;
        }
        return it;
      }
    );

    if (isNew) {
      await this.setCustomAssetList(artboards);
    }

    return artboards;
  }

  async setCustomAssetList(list) {
    this.editor.saveItem(this.customAssetKey, list);
  }

  async getCustomAsset(id) {
    const assetList = await this.getCustomAssetList();
    const it = assetList.find((it) => it.id === id);

    if (it && it.component) {
      return it.component;
    }

    return null;
  }

  /**
   * 저장될 preview 이미지를 포함해서 보여주기
   *
   * @param {string} datauri  image datauri
   */
  async saveCustomAsset(datauri = "") {
    const current = this.editor.context.selection.current;

    if (current) {
      const assetList = await this.getCustomAssetList();
      const json = await this.editor.json.render(current);

      json.x = 0;
      json.y = 0;
      await this.setCustomAssetList([
        ...assetList,
        {
          id: uuid(),
          preview: datauri,
          component: json,
        },
      ]);
    }
  }

  async removeCustomAsset(id) {
    const assetList = await this.getCustomAssetList();
    await this.setCustomAssetList(
      assetList.filter((it) => {
        return it.id !== id;
      })
    );
  }
}
