import { html } from "../src/util/functions/func";
import { timecodeToFrames, framesToTimecode } from "../src/util/functions/time";

test('func - timecodeToFrames', () => {
    var frame = timecodeToFrames(60, '00:00:01:00');

    expect(frame).toEqual(60);

    var frame = timecodeToFrames(60, '00:00:00:25');

    expect(frame).toEqual(25);    
});

test('func - framesToTimecode', () => {
    var timecode = framesToTimecode(60, 600);

    expect(timecode).toEqual('00:00:10:00')

    var timecode = framesToTimecode(29.97, 2997);

    expect(timecode).toEqual('00:01:40:00')    

});
