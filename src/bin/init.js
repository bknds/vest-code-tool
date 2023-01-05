const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const nunjucks = require('nunjucks')
const validFileName = require('valid-filename')
const {
  error,
  stopSpinner,
  exit,
  clearConsole,
} = require('./utils/common')

async function create(options) {
  console.log('options')
  const { PROJECT_NAME, MIX_NAME } = await inquirer.prompt([
    {
      name: 'PROJECT_NAME',
      message: `输入包文件名`,
      default: 'projectName',
    },
    {
      name: 'MIX_NAME',
      message: `输入变量名属性名类名文件名方法名字符`,
      default: 'mixName',
    },
  ])

  // 检查输入的名称是否合法 退出
  if (!validFileName(PROJECT_NAME) || !validFileName(MIX_NAME)) {
    console.error(chalk.red(`名称不合法`))
    exit(1)
  }

  const CWD = options.cwd || process.cwd()
  // 模板文件路径
  const TEMPLATE_FILES_PATH = path.resolve(__dirname, '../template')
  // 新包文件路径
  const NEW_PROJECT_PATH = path.resolve(CWD, `./${PROJECT_NAME}`)

  // 如果该项目已经存在，询问覆盖还是取消
  if (fs.existsSync(NEW_PROJECT_PATH)) {
    // 使用force指令，直接删除老文件夹
    if (options.force) {
      await fs.remove(NEW_PROJECT_PATH)
      return
    }
    await clearConsole()
    const { isForce } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `已存在 ${chalk.cyan(PROJECT_NAME)}：`,
        choices: [
          { name: '覆盖', value: true },
          { name: '取消', value: false },
        ],
      },
    ])
    if (!isForce) return
    await fs.remove(NEW_PROJECT_PATH)
  }

  //根据项目名称创建目标文件夹
  await fs.mkdir(NEW_PROJECT_PATH, { recursive: true })

  const copyTemplateFile = async (originFile, copyFile) => {
    try {
      // logWithSpinner(`生成 ${chalk.yellow(`${projectName}/io.js`)}`)
      const originTemplateFile = await fs.readFile(originFile)
      const content = nunjucks.renderString(originTemplateFile.toString(), {
        PROJECT_NAME,
        MIX_NAME,
      })
      await fs.writeFile(copyFile, content, { flag: 'a' })
    } catch (error) {
      console.log(error)
    }
  }

  // 遍历复制文件夹内全部文件
  const recursionCopyFiles = (
    originFilePath,
    copyFilePath,
    isLibCodeDirectory
  ) => {
    fs.readdir(originFilePath, { withFileTypes: true }, async (err, files) => {
      if (!!err) return
      for (const file of files) {
        const FILE_NAME = file.name
        const originFile = path.resolve(originFilePath, FILE_NAME)
        const copyFile = path.resolve(
          copyFilePath,
          `${
            isLibCodeDirectory && FILE_NAME !== 'main.dart' ? MIX_NAME : ''
          }${FILE_NAME}`
        )
        if (!file.isDirectory()) {
          // 不是文件夹，直接复制原始文件到目标文件夹
          isLibCodeDirectory
            ? copyTemplateFile(originFile, copyFile)
            : fs.copyFileSync(originFile, copyFile)
        } else {
          // 是文件夹, 递归调用该方法
          fs.mkdir(copyFile, (err) => {})
          const isLibCodeDirectory =
            FILE_NAME === 'lib' || originFile.includes('/lib/')
          recursionCopyFiles(originFile, copyFile, isLibCodeDirectory)
        }
      }
    })
  }
  recursionCopyFiles(TEMPLATE_FILES_PATH, NEW_PROJECT_PATH, false)
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    stopSpinner(false)
    error(err)
  })
}
