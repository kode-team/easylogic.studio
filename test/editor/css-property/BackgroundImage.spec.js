import { Length, Position } from "../../../src/editor/unit/Length";
import { BackgroundImage } from "../../../src/editor/css-property/BackgroundImage";
import { LinearGradient } from "../../../src/editor/image-resource/LinearGradient";
import { ColorStep } from "../../../src/editor/image-resource/ColorStep";
import { RadialGradient } from "../../../src/editor/image-resource/RadialGradient";
import { URLImageResource } from "../../../src/editor/image-resource/URLImageResource";

test('BackgroundImage - new BackgroundImage', () => {
    var image = new BackgroundImage();

    var css = image.toCSS()
    expect(css['background-image']).toEqual('none');
    expect(css['background-blend-mode']).toEqual('normal');
    expect(css['background-size']).toEqual('auto');
    expect(css['background-position']).toEqual('center center');
})

test('BackgroundImage - check background-blend-mode', () => {
    var image = new BackgroundImage();
    image.blendMode = 'overlay'

    var css = image.toCSS()
    expect(css['background-blend-mode']).toEqual('overlay');
})

test('BackgroundImage - check background-size', () => {
    var image = new BackgroundImage();
    image.size = 'contain'

    var css = image.toCSS()
    expect(css['background-size']).toEqual('contain');

    image.size = 'auto'
    image.width = Length.px(100);
    image.height = Length.px(100);

    css = image.toCSS()
    expect(css['background-size']).toEqual('100px 100px');
})


test('BackgroundImage - check background-position', () => {
    var image = new BackgroundImage({
        x: Length.percent(0),
        y: Length.percent(100)
    });

    var css = image.toCSS()
    expect(css['background-position']).toEqual('0% 100%');

    image.x = Position.CENTER
    var css = image.toCSS()
    expect(css['background-position']).toEqual('center 100%');    

    image.y = Position.BOTTOM
    var css = image.toCSS()
    expect(css['background-position']).toEqual('center bottom');        
})


test('BackgroundImage - check background-repeat', () => {
    var image = new BackgroundImage({
        repeat: 'no-repeat'
    });

    var css = image.toCSS()
    expect(css['background-repeat']).toEqual('no-repeat');

    image.repeat = 'repeat'
    var css = image.toCSS()
    expect(css['background-repeat']).toEqual('repeat');    

    image.repeat = 'repeat-x'
    var css = image.toCSS()
    expect(css['background-repeat']).toEqual('repeat-x');    

    image.repeat = 'repeat-y'
    var css = image.toCSS()
    expect(css['background-repeat']).toEqual('repeat-y');

    image.repeat = 'no-repeat'
    var css = image.toCSS()
    expect(css['background-repeat']).toEqual('no-repeat');
})

test('BackgroundImage - add image resource', () => {
    var image = new BackgroundImage()
    var gradient = image.addImageResource(new LinearGradient())
    gradient.addColorStepList([
        new ColorStep({color: 'yellow', percent: 0}),
        new ColorStep({color: 'red', percent: 100})
    ])

    var css = image.toCSS();
    expect(css['background-image']).toEqual('linear-gradient(to top, yellow 0%,red 100%)')

    gradient.addColorStep(new ColorStep({
        color: 'black',
        percent: 70
    }))

    var css = image.toCSS();
    expect(css['background-image']).toEqual('linear-gradient(to top, yellow 0%,black 70%,red 100%)')    

    image.addImageResource(new RadialGradient())
    image.image.addColorStepList([
        new ColorStep({color: 'yellow', percent: 50}),
        new ColorStep({color: 'blue', percent: 55})
    ])
    var css = image.toCSS();
    expect(css['background-image']).toEqual('radial-gradient(ellipse at center center, yellow 50%,blue 55%)')    

    expect(image+"").toEqual('background-image: radial-gradient(ellipse at center center, yellow 50%,blue 55%);background-position: center center;background-size: auto;background-repeat: repeat;background-blend-mode: normal');
})

test('BackgroundImage - add url image resource', () => {
    var image = new BackgroundImage()
    var resource = new URLImageResource({ url : 'https://yellow.com/image.jpg'})

    image.addImageResource(resource)

    var css = image.toCSS();
    expect(css['background-image']).toEqual('url(https://yellow.com/image.jpg)')
})
