import { editor } from "../../src/editor/editor";
import { Project } from "../../src/editor/items/Project";
import { ArtBoard } from "../../src/editor/items/ArtBoard";ㄴ
import { Layer } from "../../src/editor/items/Layer";
import { Length } from "../../src/editor/unit/Length";

let project, artboard, layer;

beforeEach(() => {
    editor.clear()
    project = editor.addProject(new Project())
    artboard = project.add(new ArtBoard({name: 'New ArtBoard'}))
    layer = artboard.add(new Layer({name: 'New Layer'}))

})

afterEach( () => {
    editor.clear()
})

test('Layer - set property', () => {
    layer.width = Length.percent(100);
    expect(layer.width+"").toEqual('100%');
    expect(layer+"").toEqual('position: absolute;width: 100%;height: 300px;box-sizing: border-box;visibility: visible;background-color: rgba(222, 222, 222, 0.3);display: block;word-wrap: break-word;word-break: break-word');
})