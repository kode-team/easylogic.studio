import { editor } from "../../src/editor/editor";
import { Project } from "../../src/editor/items/Project";
import { ArtBoard } from "../../src/editor/items/ArtBoard";
import { Layer } from "../../src/editor/items/Layer";
import { Directory } from "../../src/editor/items/Directory";
import { Length } from "../../src/editor/unit/Length";

var project, artboard, directory;

beforeEach(() => {
    editor.clear()
    project = editor.addProject(new Project())
    artboard = project.add(new ArtBoard({name: 'New ArtBoard'}))
    directory = artboard.add(new Directory({name: 'New Layer'}))

})

afterEach( () => {
    editor.clear()
})


test('Directory - add Directory', () => {
    var d = directory.add(new Directory({ name: 'Sample Group'}));

    expect(d.name).toEqual('Sample Group');
    expect(d.itemType).toEqual('directory');
    expect(directory.directories.length).toEqual(1);    
});

test('Directory - add Layer', () => {
    var newLayer = directory.add(new Layer({ name: 'Sample Layer'}));

    expect(newLayer.name).toEqual('Sample Layer');
    expect(newLayer.itemType).toEqual('layer');
    expect(directory.layers.length).toEqual(1);

    newLayer.width = Length.px(300);
    expect(newLayer.width.value).toEqual(300);
    expect(newLayer.width+"").toEqual('300px');

});