import MenuItem from "el/editor/ui/menu-items/MenuItem";
import HTMLLayerRender from 'plugins/renderer-html/HTMLRenderer/LayerRender';
import * as Event from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { Editor } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import icon from "el/editor/icon/icon";
import { Component } from 'el/editor/model/Component';
import PathParser from "el/editor/parser/PathParser";
import { Segment } from "el/editor/parser/Segment";
import Point from "el/editor/parser/Point";
import ObjectProperty from 'el/editor/ui/property/ObjectProperty';


export default {
    EditorInstance: Editor,
    Length,
    EditorElement,
    HTMLLayerRender,
    Component,
    MenuItem,
    BaseProperty,
    ObjectProperty,
    PathParser,
    Segment,
    Point,
    icon,
    ...Event
}