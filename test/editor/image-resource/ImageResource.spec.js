import { ImageResource } from "../../../src/editor/image-resource/ImageResource";

test('ImageResource - new ImageResource', () => {
    var image = new ImageResource();

    expect(image.itemType).toEqual('image-resource');
});