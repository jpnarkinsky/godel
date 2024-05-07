/**
 * This is a minimal script that generates TypeScript definitions
 * from a Chevrotain parser.
 */

import { writeFileSync } from "fs";
import { generateCstDts } from "chevrotain";
import { productions } from "./parser.ts";
// import { fileURLToPath } from "url";

const dtsString = generateCstDts(productions);
// const dtsPath = resolve("lib", "parser", "parser.d.ts");
writeFileSync("lib/parser/parser.d.ts", dtsString);