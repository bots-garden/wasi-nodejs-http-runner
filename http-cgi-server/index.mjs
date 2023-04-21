import * as fs from 'fs'
import * as path from 'path'
import * as os from 'node:os';
import * as crypto from 'node:crypto';

import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
import process from "node:process"


import { WASI } from 'wasi'

// Create and start the HTTP server
const opts = {}

const start = async () => {

    const wasmFile =fs.readFileSync("./function/main.wasm")


    fastify.post('/', opts, async (request, reply) => {

        const uniqueId = crypto.randomUUID();

        const stdinFile = path.join(os.tmpdir(), `stdin.wasm.${uniqueId}.txt`);
        const stdoutFile = path.join(os.tmpdir(), `stdout.wasm.${uniqueId}.txt`);
        const stderrFile = path.join(os.tmpdir(), `stderr.wadm.${uniqueId}.txt`);
        
        fs.writeFileSync(stdinFile, "initialize...");
        
        const stdin = fs.openSync(stdinFile, 'r');
        const stdout = fs.openSync(stdoutFile, 'a');
        const stderr = fs.openSync(stderrFile, 'a');
    
        const wasi = new WASI({
            args: ["from Node.js", "Hello Jane Doe from Node.js 💛"], // Like the args with a CLI
            env: {},
            stdin, stdout, stderr,
            returnOnExit: true
        });
    
        const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
    
        const wasm = await WebAssembly.compile(wasmFile);
    
        const instance = await WebAssembly.instantiate(wasm, importObject);
    
        const stringParameter = request.body;

        fs.writeFileSync(stdinFile, stringParameter);


        wasi.start(instance);


        let str = fs.readFileSync(stdoutFile, 'utf8').trim()
        let err = fs.readFileSync(stderrFile, 'utf8').trim()
        
        
        fs.closeSync(stdin);
        fs.closeSync(stdout);
        fs.closeSync(stderr);
        
        return str
        
    })
  
    try {
      await fastify.listen({ port: 8081, host: '0.0.0.0'})
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start().then(r => console.log("😄 started"))
