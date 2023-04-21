package main

import (
	"fmt"
	"io"
	"os"
)

func main() {

	param, _ := io.ReadAll(os.Stdin)

	fmt.Println("Hello " + string(param))

}


