package cmd

import (
	"fmt"
	_ "io/ioutil"
	"os"

	"github.com/darthchudi/darth/utils"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var configFile = "darth.yml"

var author string

func init() {
	cobra.OnInitialize(initConfig)
	rootCmd.Flags().StringVarP(&author, "author", "a", "", "Project author for the author field in package.json")
	viper.BindPFlag("author", rootCmd.Flags().Lookup("author"))
}

func initConfig() {
	// create config file if doesn't exist
	if !utils.DoesFileExist(configFile) {
		fmt.Println("No config file detected. Creating one...")
		newConfigFile, err := os.OpenFile(configFile, os.O_CREATE, 0644)
		defer newConfigFile.Close()
		utils.CheckErrorAndExit(err)
	}

	// find and read config from config file
	viper.SetConfigFile(configFile)
	utils.CheckErrorAndExit(viper.ReadInConfig())
}

var rootCmd = &cobra.Command{
	Use:   "darth [project name]",
	Short: "Darth is a simple framework for bootstrapping Node.js + TS projects",
	Long: `Darth is a simple framework built for building Node.js projects in Typescript. 
It heavily utilizes Dependency Injection via Inversify and it comes with a healthy amount of utilities.`,
	Args: cobra.ExactArgs(1),
	Run:  utils.Create,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
