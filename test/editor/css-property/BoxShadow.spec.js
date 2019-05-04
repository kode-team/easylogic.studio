import { BoxShadow } from "../../../src/editor/css-property/BoxShadow";
import { Length } from "../../../src/editor/unit/Length";

test('BoxShadow - new BoxShadow', () => {
    var box = new BoxShadow();
    expect(box + "").toEqual('0px 0px 0px 0px rgba(0, 0, 0, 0)');

    box.offsetX = Length.percent(50);
    expect(box + "").toEqual('50% 0px 0px 0px rgba(0, 0, 0, 0)');

    box.inset = true; 
    expect(box + "").toEqual('inset 50% 0px 0px 0px rgba(0, 0, 0, 0)');

    box.color = 'yellow'
    expect(box + "").toEqual('inset 50% 0px 0px 0px yellow');
})
