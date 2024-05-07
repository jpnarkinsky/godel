import {expect,  test, describe} from 'vitest';
import { parse } from "./parser.js";

describe('Basic parsing', function() {
  const {cst, lexErrors, parseErrors} = parse(`Type Foo {
    a = "yyy"
    b: integer
    c := 0
  }`)

  if (lexErrors.length > 0 || parseErrors.length > 0) {
    console.log(JSON.stringify({
      parseErrors,
      lexErrors,
    }, null, 2))
  }

  test('parses without errors', () => {
    expect(lexErrors).toHaveLength(0)
    expect(parseErrors).toHaveLength(0)
  })

  test('Can parse a simple type', () => {
    console.log(JSON.stringify(cst, null, 2));
  })
})