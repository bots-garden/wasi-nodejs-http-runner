package main

import (

	plugin "github.com/bots-garden/wasm-tinygo-pdk"
)

func main() {
	plugin.SetHandle(Handle)
}

func Handle(param []byte) ([]byte, error) {

	return []byte("Hello " + string(param)), nil
}
