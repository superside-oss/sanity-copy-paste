const fs = require('fs')
const packageJsonPath = './package.json'

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))
const splitPackageJsonVersion = packageJson.version.split('.')
const updatedPackageJsonVersion = parseInt(splitPackageJsonVersion[2]) + 1
packageJson.version =
  splitPackageJsonVersion[0] + '.' + splitPackageJsonVersion[1] + '.' + updatedPackageJsonVersion

// Write the updated package.json back to the file
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log('Package version updated successfully!')
