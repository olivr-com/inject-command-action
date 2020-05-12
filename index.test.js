const injectCommand = require('./injectCommand')
const io = require('@actions/io')
const fs = require('fs')

const TEST_DIRECTORY = './.test'
const TEST_TARGET = TEST_DIRECTORY + '/test.md'

beforeAll(() => io.mkdirP(TEST_DIRECTORY))

beforeEach(() => fs.writeFileSync(TEST_TARGET, ''))

test('fails if no command is specified', () => {
  expect.assertions(1)
  return expect(injectCommand('', TEST_TARGET)).rejects.toThrow(
    'Please specify a command'
  )
})

test('fails if target file does not exist', () => {
  fs.unlinkSync(TEST_TARGET)

  expect.assertions(1)
  return expect(injectCommand('pwd', TEST_TARGET)).rejects.toThrow(
    'Please ensure your target file already exists'
  )
})

test('fails if no pattern is specified and cannot detect pattern', () => {
  expect.assertions(1)
  return expect(injectCommand(' pwd', TEST_TARGET)).rejects.toThrow(
    'Could not detect a pattern, please specify it manually'
  )
})

test('succeeds if no pattern is specified and can detect pattern', () => {
  fs.writeFileSync(TEST_TARGET, '<!-- auto-pwd --><!-- auto-pwd -->')

  expect.assertions(1)
  return expect(injectCommand('pwd', TEST_TARGET)).resolves.toContain(
    TEST_TARGET
  )
})

test('succeeds if a pattern is specified', () => {
  const PATTERN = '<!-- my-pattern -->'
  fs.writeFileSync(TEST_TARGET, PATTERN + PATTERN)

  expect.assertions(1)
  return expect(injectCommand('pwd', TEST_TARGET, PATTERN)).resolves.toContain(
    TEST_TARGET
  )
})

test('succeeds if target does not contain the pattern and force is TRUE', () => {
  expect.assertions(1)
  return expect(injectCommand('pwd', TEST_TARGET)).resolves.toContain(
    TEST_TARGET
  )
})

test('succeeds if target does not contain the pattern and force is FALSE', () => {
  expect.assertions(1)
  return expect(
    injectCommand('pwd', TEST_TARGET, '', false)
  ).resolves.toContain('')
})

test('outputs that no file is changed if it is the case', () => {
  expect.assertions(1)
  return expect(
    injectCommand('pwd', TEST_TARGET).then(() =>
      injectCommand('pwd', TEST_TARGET)
    )
  ).resolves.toContain('')
})

afterAll(() => io.rmRF(TEST_DIRECTORY))
