/**
 * This is a minimal script that generates TypeScript definitions
 * from a Chevrotain parser.
 */

import { writeFileSync } from "fs";
import { generateCstDts } from "chevrotain";
import { productions } from "./parser.ts";

const dtsString = generateCstDts(productions);
writeFileSync("lib/parser/parser.d.ts", dtsString);