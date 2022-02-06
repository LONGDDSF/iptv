const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

beforeEach(() => {
  fs.emptyDirSync('tests/__data__/output')
  fs.emptyDirSync('tests/__data__/temp')
  fs.copyFileSync(
    'tests/__data__/input/database/generate-playlists.streams.db',
    'tests/__data__/temp/streams.db'
  )

  const stdout = execSync(
    'DB_DIR=tests/__data__/temp DATA_DIR=tests/__data__/input/data PUBLIC_DIR=tests/__data__/output/.gh-pages LOGS_DIR=tests/__data__/output/logs/generators node --trace-warnings scripts/commands/generate-playlists.js',
    { encoding: 'utf8' }
  )

  console.log(stdout)
})

it.each([
  '.gh-pages/categories/general.m3u',
  '.gh-pages/categories/legislative.m3u',
  '.gh-pages/categories/news.m3u',
  '.gh-pages/categories/other.m3u',
  'logs/generators/categories.log'
])('can generate %s', filepath => {
  expect(content(`output/${filepath}`)).toBe(content(`expected/${filepath}`))
})

it.each(['countries/ru.m3u', 'countries/uk.m3u', 'countries/undefined.m3u'])(
  'can generate %s',
  filepath => {
    expect(content(`output/.gh-pages/${filepath}`)).toBe(content(`expected/.gh-pages/${filepath}`))
  }
)

function content(filepath) {
  return fs.readFileSync(`tests/__data__/${filepath}`, {
    encoding: 'utf8'
  })
}
