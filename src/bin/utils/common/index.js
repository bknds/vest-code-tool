;[
  'logger',
  'spinner',
  'exit',
].forEach(m => {
  Object.assign(exports, require(`./${m}`))
})