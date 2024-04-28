import { foo } from "../lib/foo"

import { expect, jest, test } from '@jest/globals';


test('foo', async () => {
    expect(foo()).toBe("Foo")
});