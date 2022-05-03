import {
  Entity,
  entityList,
  Enum,
  enumValue,
  stringList,
  stringMap,
  stringValue,
} from "@entityjs/entityjs";

import { MenuItemType } from "../types/editor";

export const MenuItemTypeEnum = new Enum(
  MenuItemType.DROPDOWN,
  MenuItemType.BUTTON,
  MenuItemType.LINK
);

export class MenuItemEntity extends Entity {
  type = enumValue(MenuItemTypeEnum);
  icon = stringValue();
  style = stringMap();
}

export class DropDownItemEntity extends Entity {
  title = stringValue();
  command = stringValue();
  shortcut = stringValue();
  events = stringList().default([]);
}

export class DropdownMenuItemEntity extends MenuItemEntity {
  items = entityList(DropDownItemEntity);
}

export class ButtonMenuItemEntity extends MenuItemEntity {}

export class LinkMenuItemEntity extends MenuItemEntity {}
// union 타입으로 만들기
// export type MenuItemEntity = DropdownMenuItemEntity | ButtonItemEntity;
Entity.union(
  MenuItemEntity,
  DropdownMenuItemEntity,
  ButtonMenuItemEntity,
  LinkMenuItemEntity
);

export class ToolBarRendererItemEntity extends Entity {
  items = entityList(MenuItemEntity);
}

/**
 * ToolbarItem Entity
 */
export const ToolbarItemEntity = new ToolBarRendererItemEntity();
