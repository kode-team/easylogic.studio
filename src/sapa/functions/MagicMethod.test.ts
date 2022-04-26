import { expect, test } from "vitest";

import { MagicMethod } from "./MagicMethod";

test("parse MagicMethod", () => {
  const parsedValue = MagicMethod.parse(
    "@magic:domevent keydown $input | Enter | after(preventDefault)"
  );

  // console.log(JSON.stringify(parsedValue, null, 2));

  expect(parsedValue).toEqual({
    originalMethod:
      "@magic:domevent keydown $input | Enter | after(preventDefault)",
    method: "domevent",
    args: ["keydown", "$input"],
    pipes: [
      {
        type: "keyword",
        value: "Enter",
      },
      {
        type: "function",
        value: "after(preventDefault)",
        func: "after",
        args: ["preventDefault"],
      },
    ],
    keys: {
      function: [
        {
          type: "function",
          value: "after(preventDefault)",
          func: "after",
          args: ["preventDefault"],
        },
      ],
      keyword: [
        {
          type: "keyword",
          value: "Enter",
        },
      ],
      value: [],
    },
  });
});

test("parse MagicMethod - sample 2", () => {
  const parsedValue = MagicMethod.parse("@magic:domevent click $el button");

  // console.log(JSON.stringify(parsedValue, null, 2));

  expect(parsedValue).toEqual({
    originalMethod: "@magic:domevent click $el button",
    method: "domevent",
    args: ["click", "$el", "button"],
    pipes: [],
    keys: {
      function: [],
      keyword: [],
      value: [],
    },
  });
});

test("parse MagicMethod - sample 3", () => {
  const parsedValue = MagicMethod.parse(
    "@magic:domevent keydown|$input | Enter | after(preventDefault)"
  );

  console.log(JSON.stringify(parsedValue, null, 2));

  expect(parsedValue).toEqual({
    originalMethod:
      "@magic:domevent keydown|$input | Enter | after(preventDefault)",
    method: "domevent",
    args: ["keydown"],
    pipes: [
      {
        type: "keyword",
        value: "input",
      },
      {
        type: "keyword",
        value: "Enter",
      },
      {
        type: "function",
        value: "after(preventDefault)",
        func: "after",
        args: ["preventDefault"],
      },
    ],
    keys: {
      function: [
        {
          type: "function",
          value: "after(preventDefault)",
          func: "after",
          args: ["preventDefault"],
        },
      ],
      keyword: [
        {
          type: "keyword",
          value: "input",
        },
        {
          type: "keyword",
          value: "Enter",
        },
      ],
      value: [],
    },
  });
});

test("parse MagicMethod - sample 2", () => {
  const parsedValue = MagicMethod.parse(
    "@magic:subscribe updateList| | selfTrigger() | debounce(100)"
  );

  console.log(JSON.stringify(parsedValue, null, 2));

  expect(parsedValue).toEqual({
    originalMethod:
      "@magic:subscribe updateList| | selfTrigger() | debounce(100)",
    method: "subscribe",
    args: ["updateList"],
    pipes: [
      {
        type: "function",
        value: "selfTrigger()",
        func: "selfTrigger",
        args: [""],
      },
      {
        type: "function",
        value: "debounce(100)",
        func: "debounce",
        args: ["100"],
      },
    ],
    keys: {
      function: [
        {
          type: "function",
          value: "selfTrigger()",
          func: "selfTrigger",
          args: [""],
        },
        {
          type: "function",
          value: "debounce(100)",
          func: "debounce",
          args: ["100"],
        },
      ],
      keyword: [],
      value: [],
    },
  });
});
