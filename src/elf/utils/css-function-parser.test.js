import { expect, test } from "vitest";

import { parseGroupValue, parseValue } from "./css-function-parser";

test("create css multi linear-gradient path timing test ", () => {
  const result = parseValue(
    `
        repeating-linear-gradient(1px, 2px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100% path(M 0 0 C 0.25 0.25 0.75 0.75 1 1))
    `,
    "background-image"
  );

  const [gradient] = result;
  const [, , , lastColorStep] = gradient.parameters;
  const [, , path] = lastColorStep;

  expect(path).toEqual({
    matchedString: "path(M 0 0 C 0.25 0.25 0.75 0.75 1 1)",
    startIndex: 69,
    endIndex: 106,
    func: "path",
    args: "M 0 0 C 0.25 0.25 0.75 0.75 1 1",
    parameters: ["M 0 0 C 0.25 0.25 0.75 0.75 1 1"],
    parsed: {
      funcType: "timing",
      name: "path",
      d: "M 0 0 C 0.25 0.25 0.75 0.75 1 1",
    },
    fullTextStartIndex: 104,
    fullTextEndIndex: 141,
  });
});

test("create css multi linear-gradient timing test -  with comma ", () => {
  const result = parseValue(
    `
        repeating-linear-gradient(1px, 2px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),
        repeating-linear-gradient(epx, 2px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)
    `,
    "background-image"
  );

  expect(result.length).toEqual(3);
  expect(result[0].func).toEqual("repeating-linear-gradient");
  expect(result[1].func).toEqual("comma");
  expect(result[2].func).toEqual("repeating-linear-gradient");
});

test("create css multi linear-gradient timing test - group function", () => {
  const result = parseGroupValue(
    `
        repeating-linear-gradient(1px, 2px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%),
        repeating-linear-gradient(epx, 2px, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)
    `,
    "background-image"
  );

  expect(result.length).toEqual(2);
});

test("create css multi linear-gradient timing test - group function", () => {
  const result = parseGroupValue(
    "repeating-linear-gradient(10px, white),repeating-linear-gradient(20px red)",
    "background-image"
  );

  expect(result[1][0].parameters[0][0]).toEqual({
    matchedString: "20px",
    startIndex: 0,
    endIndex: 4,
    func: "length",
    parsed: { value: 20, unit: "px" },
    fullTextStartIndex: 65,
    fullTextEndIndex: 69,
  });
});

test("create css 8 digit color", () => {
  const result = parseValue("#ffffff34");

  expect(result).toEqual([
    {
      matchedString: "#ffffff34",
      startIndex: 0,
      endIndex: 9,
      func: "hex",
      parsed: {
        funcType: "color",
        type: "hex",
        r: 255,
        g: 255,
        b: 255,
        a: 0.20392156862745098,
        h: 0,
        s: 0,
        l: 100,
      },
    },
  ]);
});

test("create css color parser", () => {
  const result = parseValue(
    "#FFFFFF white rgba(255, 255, 0.1, 0.5), hsl(360, 0.1, 0.1)"
  );

  // console.log(JSON.stringify(result, null, 2));

  expect(result).toEqual([
    {
      matchedString: "#FFFFFF",
      startIndex: 0,
      endIndex: 7,
      func: "hex",
      parsed: {
        funcType: "color",
        type: "hex",
        r: 255,
        g: 255,
        b: 255,
        a: 1,
        h: 0,
        s: 0,
        l: 100,
      },
    },
    {
      matchedString: "white",
      startIndex: 8,
      endIndex: 13,
      func: "color",
      parsed: {
        funcType: "color",
        type: "rgb",
        r: 255,
        g: 255,
        b: 255,
        a: 1,
        h: 0,
        s: 0,
        l: 100,
      },
    },
    {
      matchedString: "rgba(255, 255, 0.1, 0.5)",
      startIndex: 14,
      endIndex: 38,
      func: "rgba",
      args: "255, 255, 0.1, 0.5",
      parameters: ["255", "255", "0.1", "0.5"],
      parsed: {
        funcType: "color",
        type: "rgb",
        r: 255,
        g: 255,
        b: 0,
        a: 0.5,
        h: 60,
        s: 100,
        l: 50,
      },
    },
    { matchedString: ",", startIndex: 38, endIndex: 39, func: "comma" },
    {
      matchedString: "hsl(360, 0.1, 0.1)",
      startIndex: 40,
      endIndex: 58,
      func: "hsl",
      args: "360, 0.1, 0.1",
      parameters: ["360", "0.1", "0.1"],
      parsed: {
        funcType: "color",
        type: "hsl",
        h: 360,
        s: 0.1,
        l: 0.1,
        a: 1,
        r: 0,
        g: 0,
        b: 0,
      },
    },
  ]);
});

test("create css function parser", () => {
  const result = parseValue(
    "linear-gradient( #FFFFFF white steps(5, step-start))"
  );
  expect(result[0].parameters[0][0].matchedString).toEqual("#FFFFFF");
});

test("create linear-gradient parser", () => {
  const result = parseValue("linear-gradient( #FFFFFF, white)");

  expect(result[0].func).toEqual("linear-gradient");
});

test("create css linear-gradient parser with offset and color", () => {
  const result = parseValue(
    "linear-gradient(to right, rgb(255, 0, 0) 0%, blue 100%)"
  );

  // console.log(JSON.stringify(result, null, 2))

  expect(result[0].parameters.length).toEqual(3);
});

test("create timing function", () => {
  const result = parseValue(
    "linear-gradient(to right, rgb(255, 0, 0) 0%, blue 100% ease 10)"
  );

  // console.log(JSON.stringify(result, null, 2));

  expect(result[0].parameters.length).toEqual(3);
});

test("create timing function - ease", () => {
  const result = parseValue("ease");

  expect(result).toEqual([
    {
      matchedString: "ease",
      startIndex: 0,
      endIndex: 4,
      func: "ease",
      parsed: {
        funcType: "timing",
        name: "ease",
        matchedString: "ease",
        x1: 0.25,
        y1: 0.1,
        x2: 0.25,
        y2: 1,
      },
    },
  ]);
});

test("create timing function - linear", () => {
  const result = parseValue("linear");

  expect(result).toEqual([
    {
      matchedString: "linear",
      startIndex: 0,
      endIndex: 6,
      func: "linear",
      parsed: {
        funcType: "timing",
        name: "linear",
        matchedString: "linear",
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
      },
    },
  ]);
});
