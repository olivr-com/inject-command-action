const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

let injectCommand = async function (
  input_command,
  target,
  input_pattern = '',
  force = true
) {
  const command_parts = input_command.match(/^([^\s$]+)/i)

  if (!input_command) throw Error('Please specify a command')

  if (!input_pattern && (!command_parts || !command_parts[1]))
    throw Error('Could not detect a pattern, please specify it manually')

  if (!fs.existsSync(target))
    throw Error('Please ensure your target file already exists')

  const pattern_text =
    input_pattern || `<!-- auto-${command_parts[1].toLowerCase()} -->`

  const pattern_regex = new RegExp(
    `(${pattern_text})[\\s\\S]*${pattern_text}`,
    'i'
  )
  const target_content = fs.readFileSync(target, 'utf8')

  const { stdout, stderr } = await exec(input_command)
  if (stderr) throw Error(stderr)

  // Remove any existing match of the pattern in the output
  let output_content = stdout.replace(RegExp(pattern_text, 'ig'), '')

  // Add the pattern at the begining and at the end of the partial
  output_content = pattern_text + '\n' + output_content + '\n' + pattern_text

  let new_target_content

  if (!pattern_regex.test(target_content) && force == true) {
    console.log(target_content)
    console.log('--------------------------')
    console.log('--------------------------')
    console.log('--------------------------')
    console.log('--------------------------')
    new_target_content = target_content + '\n' + output_content
    console.log(new_target_content)
  } else {
    new_target_content = target_content.replace(pattern_regex, output_content)
  }

  if (target_content == new_target_content) return [pattern_text, '']
  else {
    fs.writeFileSync(target, new_target_content)
    return [pattern_text, target]
  }
}

module.exports = injectCommand
