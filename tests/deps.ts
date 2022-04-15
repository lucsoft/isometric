export * from "https://deno.land/std@0.135.0/testing/bdd.ts";
export * from "https://deno.land/std@0.135.0/testing/asserts.ts";
export { assertSnapshot } from "https://raw.githubusercontent.com/hyp3rflow/deno_std/feat/assertSnapshot/testing/asserts.ts";
export {
    assertSpyCall,
    assertSpyCalls,
    spy,
} from "https://deno.land/std@0.135.0/testing/mock.ts";
import { JSDOM } from "https://jspm.dev/npm:jsdom-deno@19.0.1";
const { window } = new JSDOM("");
globalThis.document = window.document;