import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../calculations.js', import.meta.url), 'utf8');
const context = { globalThis: {} };
vm.runInNewContext(source, context);
const calc = context.globalThis.PensionCalculations;

function closeTo(actual, expected, tolerance = 1e-9) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

test('present value of 30 annual payments at 5%', () => {
  closeTo(calc.presentValue(0.05), 15.3724510269, 1e-9);
});

test('zero-rate present value equals the sum of payments', () => {
  assert.equal(calc.presentValue(0, 30, 1), 30);
});

test('Macaulay and modified duration are internally consistent', () => {
  const macaulay = calc.macaulayDuration(0.05);
  const modified = calc.modifiedDuration(0.05);
  closeTo(macaulay, 11.9691389518, 1e-9);
  closeTo(modified, macaulay / 1.05, 1e-12);
});

test('duration estimate has the correct sign and scale', () => {
  const estimate = calc.durationChange(0.05, 0.01);
  assert.ok(estimate < 0);
  closeTo(estimate, -calc.modifiedDuration(0.05) * 0.01, 1e-12);
});

test('exact liability change includes convexity', () => {
  const down = calc.exactChange(0.05, 0.04);
  const up = calc.exactChange(0.05, 0.06);
  assert.ok(down > Math.abs(up));
  assert.ok(down > 0 && up < 0);
});

test('equity allocation reaches the target return', () => {
  const weight = calc.requiredEquityWeight(0.06, 0.09, 0.07);
  closeTo(weight, 1 / 3, 1e-12);
  closeTo((1 - weight) * 0.06 + weight * 0.09, 0.07, 1e-12);
});

test('allocation is zero when bonds already meet target', () => {
  assert.equal(calc.requiredEquityWeight(0.07, 0.09, 0.07), 0);
});

test('allocation flags leverage when equity requires more than 100%', () => {
  assert.ok(calc.requiredEquityWeight(0.06, 0.065, 0.07) > 1);
});
