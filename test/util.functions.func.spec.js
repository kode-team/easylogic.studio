import { html } from "../src/util/functions/func";

test('func - html', () => {
    var str = html ``
    expect(str).toEqual('');
});


test('func - html 2', () => {
    var str = html`${'a'}`
    expect(str).toEqual('a');
});

test('func - html short tag ', () => {
    var str = html`<b a='1' /><b b='2' />`
    expect(str).toEqual(`<b a='1' ></b> <b b='2' ></b>`);
});

test('func - html object import', () => {
    var Obj = {b: 10}
    var str = html`<B a='1' ${Obj} />`
    expect(str).toEqual(`<B a='1' b="10" ></B>`);
})

test('func - html function import', () => {
    var Obj = {b: 10}
    var str = html`<B a='1' ${() => Obj} />`
    expect(str).toEqual(`<B a='1' b="10" ></B>`);
})

