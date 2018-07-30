#!/usr/bin/env node
const yargs = require('yargs')
const assert = require('assert')
const childProcess = require('child_process')
const path = require('path')
const inquirer = require('inquirer');
const fs = require('fs')
const Handlebars =require('handlebars')


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

const pathOuter = dest||process.cwd();


(async()=>{
    const answer = await inquirer.prompt([
         {
             type: 'input',
             name: 'name',
             message: 'name'
         }
     ])
    const newPath = path.resolve(pathOuter,answer.name)
    fs.renameSync(path.resolve(pathOuter,folderName), newPath)
    const option = {
        srcPath:path.resolve(newPath,'package.json'),
        data:{ "name": answer.name}
    }
    await f(option)

    console.log('end')

})()


function f(option){
    const {srcPath,data} = option
    return new Promise(resolve => {
        const source = fs.readFileSync(srcPath,{encoding:'utf8'})
        const template = Handlebars.compile(source);
        const result = template(data)
        fs.writeFileSync(srcPath,result)
        resolve()
    })
}




