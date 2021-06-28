
import { Component } from "el/editor/items/Component";
import MenuItem from "el/editor/ui/menu-items/MenuItem";
import LayerRender from 'el/editor/renderer/HTMLRenderer/LayerRender';
import * as Event from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";


export default {
    EditorElement,
    LayerRender,
    Component,
    MenuItem,
    ...Event
}