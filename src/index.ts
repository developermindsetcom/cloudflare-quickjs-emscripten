import { shouldInterruptAfterDeadline } from "quickjs-emscripten"

import type { QuickJSWASMModule } from 'quickjs-emscripten';
import { newQuickJSWASMModule, DEBUG_SYNC as baseVariant, newVariant } from 'quickjs-emscripten';
import cloudflareWasmModule from './DEBUG_SYNC.wasm';
import cloudflareWasmModuleSourceMap from './DEBUG_SYNC.wasm.map.txt';

const cloudflareVariant = newVariant(baseVariant, {
    wasmModule: cloudflareWasmModule,
    wasmSourceMapData: cloudflareWasmModuleSourceMap,
});

let QuickJS: QuickJSWASMModule | undefined;

addEventListener("fetch", async (event) => {
    event.respondWith(serverResponse(event));
});

const serverResponse = async (event:FetchEvent) => {
    QuickJS = await newQuickJSWASMModule(cloudflareVariant);
    const result = QuickJS.evalCode("1 + 1", {
        shouldInterrupt: shouldInterruptAfterDeadline(Date.now() + 1000),
        memoryLimitBytes: 1024 * 1024,
    })

    const body = JSON.stringify({result}, null, 2)
    const headers =  {'content-type': 'application/json'}
    const response = new Response(body, {headers})
    return response
}