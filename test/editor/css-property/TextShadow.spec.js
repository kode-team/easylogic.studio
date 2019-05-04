import { Length } from "../../../src/editor/unit/Length";
import { TextShadow } from "../../../src/editor/css-property/TextShadow";

test('TextShadow - new TextShadow', () => {
    var box = new TextShadow();
    expect(box + "").toEqual('0px 0px 0px rgba(0, 0, 0, 0)');

    box.offsetX = Length.percent(50);
    expect(box + "").toEqual('50% 0px 0px rgba(0, 0, 0, 0)');

    box.color = 'yellow'
    expect(box + "").toEqual('50% 0px 0px yellow');
})
