import { test } from "vitest";

import { Dom } from "./Dom";
import { DomDiff } from "./DomDiff";

test("dom diff children check", () => {
  const A = Dom.createByHTML(`<div><span key="test"></span><a></a></div>`);
  const B = Dom.createByHTML(
    `<div><span key="yellow"></span><span key="test"></span></div>`
  );

  const firstKey = A.first.attr("key");

  console.log(A.first, B.first);

  DomDiff(A, B);

  console.log(A.children().map((it) => it.outerHTML()));

  console.log(firstKey, A.first.attr("key"));
  //   expect(firstKey === A.first.attr("key")).toBe(true);
});
