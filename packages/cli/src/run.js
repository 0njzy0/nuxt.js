import consola from 'consola'
import NuxtCommand from './command'
import * as commands from './commands'
import listCommands from './list'
import { existsLocalCommand, loadLocalCommand } from './local'

export default function run() {
  const defaultCommand = 'dev'
  let cmd = process.argv[2]

  if (commands[cmd]) { // eslint-disable-line import/namespace
    process.argv.splice(2, 1)
  } else if (existsLocalCommand(cmd)) {
    return loadLocalCommand(cmd).run()
      .catch(error => consola.fatal(error))
  } else if (existsExternalCommand(cmd)) {
    return loadExternalCommand(cmd).run()
      .catch(error => consola.fatal(error))
  } else {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
      listCommands().then(() => process.exit(0))
      return
    }
    cmd = defaultCommand
  }

  return NuxtCommand.load(cmd)
    .then(command => command.run())
    .catch(error => consola.fatal(error))
}
