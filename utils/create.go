package utils

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/otiai10/copy"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// Project defines a project created with the darth [project-name] command
type Project struct {
	Author      string
	Dir         string
	ProjectName string
	FullPath    string
}

// Create creates a Node + TS project in the specified directory
func Create(cmd *cobra.Command, args []string) {
	project, err := filepath.Abs(args[0])
	CheckError(err)
	dir := filepath.Dir(project)
	projectName := filepath.Base(project)

	// bail if folder exists already
	if DoesFileExist(project) {
		log.Fatalf("Create %s: Folder exists already. Please pick a different project name.", projectName)
	}

	// check if an author name was passed as a flag or exists in config.
	// if it doesn't request for it from stdin
	var author string
	if author = viper.GetString("author"); author == "" {
		fmt.Print("Please enter the package author email: ")
		_, err := fmt.Scan(&author)
		CheckError(err)
		viper.Set("author", author)
	}

	fmt.Printf("Creating project: %s...\n", projectName)

	NewProject := Project{author, dir, projectName, project}

	scaffold(NewProject)
}

func scaffold(project Project) {
	// create project directory
	err := os.MkdirAll(project.FullPath, os.ModePerm)
	CheckError(err)

	createIndexFiles(project)

	// create VSCode folder
	copy.Copy(filepath.Join(srcDir, ".vscode"), filepath.Join(project.FullPath, ".vscode"))

	// create typings folder
	copy.Copy(filepath.Join(srcDir, "typings"), filepath.Join(project.FullPath, "typings"))

	// create common folder
	copy.Copy(filepath.Join(srcDir, "common"), filepath.Join(project.FullPath, "src/common"))

	// create data folder
	copy.Copy(filepath.Join(srcDir, "data"), filepath.Join(project.FullPath, "src/data"))

	// create server folder
	copy.Copy(filepath.Join(srcDir, "server"), filepath.Join(project.FullPath, "src/server"))

	// install dependencies
	// check if yarn is installed, if it isn't fall back to npm
	var installDepsOutput, installDepsError bytes.Buffer
	installDeps := exec.Command("sh", "-c", "yarn -v && yarn || npm install")
	installDeps.Dir = project.FullPath
	installDeps.Stdout = &installDepsOutput
	installDeps.Stderr = &installDepsError
	CheckErrorAndExit(installDeps.Run())

	// initialize git and make first commit
	// git := exec.Command("sh", "-c", "git --version && git init && git add . && git commit -m 'chore: initial commit'")
	// git.Dir = project.FullPath
	// err = git.Run()
	// CheckErrorAndExit(err);
}

// creates files found at the root of the folder
// e.g package.json and tsconfig.json
func createIndexFiles(project Project) {
	// create files from templates first
	templateGlob := "lib/templates/*.tmpl"
	templates, err := template.ParseGlob(templateGlob)
	CheckError(err)
	templateNames, err := filepath.Glob(templateGlob)
	CheckError(err)

	for _, templateName := range templateNames {
		fileName := filepath.Base(strings.Split(templateName, ".tmpl")[0])

		file, err := os.Create(filepath.Join(project.FullPath, fileName))
		CheckError(err)
		defer file.Close()

		err = templates.ExecuteTemplate(file, fileName+".tmpl", project)
		CheckError(err)
	}

	// create tsconfig.json
	// generateFile("tsconfig.json", project.FullPath)
	err = copy.Copy("lib/src/tsconfig.json",
		filepath.Join(project.FullPath, "tsconfig.json"))

	CheckErrorAndExit(err)
}
