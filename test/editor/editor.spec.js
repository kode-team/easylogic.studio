import { editor } from "../../src/editor/editor";
import { Project } from "../../src/editor/items/Project";
import { ArtBoard } from "../../src/editor/items/ArtBoard";
import { Layer } from "../../src/editor/items/Layer";

beforeEach(() => {
    editor.removeChildren()
})

test('Editor - normal', () => {
    editor.set('a', 'b');

    expect(editor.get('a')).toEqual('b');
});

test('Editor - add project', () => {
    editor.addProject(new Project())
    expect(editor.projects.length).toEqual(1);

    editor.addProject(new Project());
    expect(editor.projects.length).toEqual(2);
})

test('Editor - addArtBoard', () => {
    var project = editor.addProject(new Project())

    project.add(new ArtBoard())

    expect(project.artboards.length).toEqual(1);

    project.artboards.forEach(artboard => {
        expect(typeof artboard.id).toEqual('string');
    });
}) 

test('Editor - removeChildren', () => {
    var project = editor.addProject(new Project())
    expect(editor.projects.length).toEqual(1);
    editor.removeChildren()
    expect(editor.projects.length).toEqual(0);
})

test('Editor - config', () => {
    editor.config.a = 'b';

    expect(editor.config.a).toEqual('b')
})

test('Editor - clone', () => {
    var project = editor.addProject(new Project());
    var artboard = project.add(new ArtBoard());
    var layer = artboard.add(new Layer());

    var cloneLayer = layer.clone(true)

    expect(layer.id != cloneLayer.id).toEqual(true);
})

test('Editor - copy', () => {
    var project = editor.addProject(new Project());
    var artboard = project.add(new ArtBoard());
    artboard.add(new Layer());
    artboard.add(new Layer());
    artboard.add(new Layer());
    artboard.add(new Layer());
    artboard.add(new Layer());

    var newArtBoard = artboard.copy()

    expect(artboard.layers.length).toEqual(newArtBoard.length-1)

})