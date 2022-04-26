import { expect, test } from "vitest";

import { step } from "./steps";

test("steps", () => {
  const func = step(1, "start");

  expect(func(0)).toBe(0);
  expect(func(0.5)).toBe(1);
  expect(func(1)).toBe(1);
});

test("steps - count 5", () => {
  const func = step(5, "start");

  expect(func(0)).toBe(0);
  expect(Math.abs(func(0.1) - 0.2) < 0.000001).toBe(true);
  expect(Math.abs(func(0.15) - 0.2) < 0.000001).toBe(true);
  expect(Math.abs(func(0.2) - 0.2) < 0.000001).toBe(true);
  expect(Math.abs(func(0.4) - 0.4) < 0.000001).toBe(true);
  expect(Math.abs(func(0.6) - 0.6) < 0.000001).toBe(true);
  expect(Math.abs(func(0.8) - 0.8) < 0.000001).toBe(true);
  expect(Math.abs(func(0.85) - 1) < 0.000001).toBe(true);
  expect(Math.abs(func(0.9) - 1) < 0.000001).toBe(true);
  expect(Math.abs(func(0.95) - 1) < 0.000001).toBe(true);
  expect(func(1)).toBe(1);
});

test("steps - count 5", () => {
  const func = step(5, "end");

  expect(func(0)).toBe(0);
  expect(Math.abs(func(0.1) - 0) < 0.000001).toBe(true);
  expect(Math.abs(func(0.15) - 0) < 0.000001).toBe(true);
  expect(Math.abs(func(0.2) - 0) < 0.000001).toBe(true);
  expect(Math.abs(func(0.4) - 0.2) < 0.000001).toBe(true);
  expect(Math.abs(func(0.6) - 0.4) < 0.000001).toBe(true);
  expect(Math.abs(func(0.8) - 0.6) < 0.000001).toBe(true);
  expect(Math.abs(func(0.9) - 0.8) < 0.000001).toBe(true);
  expect(Math.abs(func(0.95) - 0.8) < 0.000001).toBe(true);
  expect(func(1)).toBe(1);
});
