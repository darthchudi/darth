package utils

import (
	"fmt"
	"os"
)

// CheckError checks if an error exists and logs it.
func CheckError(err error) {
	if err != nil {
		fmt.Println(err)
	}
}

// CheckErrorAndExit checks if an error exists, logs it and exits the program.
func CheckErrorAndExit(err error) {
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
