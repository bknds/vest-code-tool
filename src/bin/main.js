#!/usr/bin/env node
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../../package.json').engines.node

// 自定义错误提示信息
const enhanceErrorMessages = require('./utils/enhanceErrorMessages')


// 检测node版本函数
function checkNodeVersion() {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.log(
      chalk.red(
        `Node版本需${requiredVersion}，当前Node版本号为：${process.version}。\n请升级本地Node版本`
      )
    )
    process.exit(1)
  }
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

// 获取参数
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ''))
    // 如果没有传递option或者有与之相同的命令，终止
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

checkNodeVersion()

// 初始化处理命令
const program = require('commander')
program.version(require('../../package').version).usage('<command> [options]')
if (!process.argv.slice(2).length) program.outputHelp()
// 生成白包基础包指令
program
  .command('init')
  .description('创建白包模板文件')
  .option('-f, --force', '覆盖已存在目标项目')
  .action((cmd) => {
    const options = cleanArgs(cmd)
    require('./init')(options)
  })

program.arguments('<command>').action((cmd) => {
  program.outputHelp()
  console.log(chalk.red(`使用了未知命令：“${chalk.yellow(cmd)}”.`))
})


program.parse(process.argv)

// 缺少参数的错误提示
enhanceErrorMessages('missingArgument', (argName) => {
  return `缺少必要参数 ${chalk.yellow(`<${argName}>`)}.`
})
