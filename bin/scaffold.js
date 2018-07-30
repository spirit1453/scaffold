#!/usr/bin/env node
const yargs = require('yargs')
const assert = require('assert')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const path = require('path')

const {argv} = yargs
const {repo,branch,dest} = argv
assert(repo)

let str = ''
if(branch){
    str = `--branch=${branch}`
}

let str2 = ''
if(dest){
    str2 = `${dest}`
}

let gitCmd = `
    git clone ${str} ${repo} ${str2}
`
const result = childProcess.execSync(gitCmd)
console.log(result.toString())

const folderName = repo.split('/').pop().split('.')[0]

childProcess.execSync(`
    rm -rf "${folderName}/.git"
`)



console.log(argv)
