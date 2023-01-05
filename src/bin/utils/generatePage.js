const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const nunjucks = require('nunjucks')

const { log, error, logWithSpinner, stopSpinner } = require('./common')

const tempPath = path.resolve(__dirname, '../../temp')
const templateDirPath = path.resolve(__dirname, '../../template')
const pageTempPath = path.resolve(tempPath, 'page.js')
const lessTempPath = path.resolve(tempPath, 'page.less')
const ioTempPath = path.resolve(tempPath, 'io.js')
const storeTempPath = path.resolve(tempPath, 'store.js')

async function generatePage(context, { projectName, mixName }) {
  logWithSpinner(`生成 ${chalk.yellow(`${projectName}/${projectName}.js`)}`)
  const ioTemp = await fs.readFile(pageTempPath)
  const ioContent = nunjucks.renderString(ioTemp.toString(), { mixName })
  await fs.writeFile(path.resolve(context, `./${projectName}.js`), ioContent, {
    flag: 'a',
  })
  stopSpinner()
}

async function generateLess(context, { projectName, mixName }) {
  logWithSpinner(`生成 ${chalk.yellow(`${projectName}/${projectName}.less`)}`)
  const ioTemp = await fs.readFile(lessTempPath)
  const ioContent = nunjucks.renderString(ioTemp.toString(), { mixName })
  await fs.writeFile(
    path.resolve(context, `./${projectName}.less`),
    ioContent,
    { flag: 'a' }
  )
  stopSpinner()
}

async function generateIo(context, { projectName, mixName }) {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }

  fs.readdir(templateDirPath, (err, files) => {
    //生成由文件名组成的一个数组
    if (!!err) return
    
    if (!fs.existsSync('./../one')) {
      //没有该文件夹
      fs.mkdirSync('./../one') //创建one目录
    } else {
      //拷贝目录
      files.forEach((item, index) => {
        //遍历原目录下的文件名
        var item_path = path.join(__dirname, item) //获取原文件路径
        var temp = fs.statSync(item_path) //获取原目录下所有文件的文件信息
        if (temp.isFile()) {
          // 是文件
          fs.copyFileSync(item_path, path.join('./../one', item))
        } else if (temp.isDirectory()) {
          // 是目录
          CopyDirectory(item_path, path.join('./../one', item))
        }
      })
    }
  })
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })

  logWithSpinner(`生成 ${chalk.yellow(`${projectName}/io.js`)}`)
  const ioTemp = await fs.readFile(ioTempPath)
  const ioContent = nunjucks.renderString(ioTemp.toString(), { mixName })
  await fs.writeFile(path.resolve(context, `./io.js`), ioContent, { flag: 'a' })
  stopSpinner()
}

async function generateStore(context, { projectName, mixName }) {
  logWithSpinner(`生成 ${chalk.yellow(`${projectName}/store-${mixName}.js`)}`)
  const ioTemp = await fs.readFile(storeTempPath)
  const ioContent = nunjucks.renderString(ioTemp.toString(), { mixName })
  await fs.writeFile(
    path.resolve(context, `./store-${mixName}.js`),
    ioContent,
    { flag: 'a' }
  )
  stopSpinner()
}

module.exports = (context, nameObj) => {
  Promise.all([
    generateIo(context, nameObj),
    generatePage(context, nameObj),
    generateStore(context, nameObj),
    generateLess(context, nameObj),
  ]).catch((err) => {
    stopSpinner(false)
    error(err)
  })
}
