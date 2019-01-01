package utils

import (
	"fmt"
	_ "os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Create creates a Node + TS project in the specified directory
func Create(cmd *cobra.Command, args []string) {
	project, err := filepath.Abs(args[0])
	CheckError(err)
	//dir := filepath.Dir(project)
	projectName := filepath.Base(project)

	// check if an author name was passed as a flag or exists in config.
	// if it doesn't request for it from stdin
	if author := viper.GetString("author"); author == "" {
		fmt.Print("Please enter the package author email: ")
		_, err := fmt.Scan(&author)
		CheckError(err)
		viper.Set("author", author)
	}

	fmt.Printf("Creating project: %s...", projectName)
}
