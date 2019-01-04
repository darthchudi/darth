package utils

import (
	"os"
)

// srcDir is the directory that holds the library source files
var srcDir = "lib/src"

// templateDir is the directory that holds the templates
var templateDir = "lib/templatates/"

// DoesFileExist checks if a given file exists in the filesystem
func DoesFileExist(file string) bool {
	if _, err := os.Stat(file); os.IsNotExist(err) {
		return false
	}
	return true
}
