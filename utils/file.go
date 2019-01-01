package utils

import "os"

// DoesFileExist checks if a given file exists in the filesystem
func DoesFileExist(file string) bool {
	if _, err := os.Stat(file); os.IsNotExist(err) {
		return false
	}
	return true
}
