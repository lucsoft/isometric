import { serve } from "https://deno.land/x/esbuild_serve@0.0.5/mod.ts"

serve({
    port: 4321,
    pages: {
        "index": "./demo.ts"
    }
})