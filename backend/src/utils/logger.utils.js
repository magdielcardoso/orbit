import util from 'util'

export function formatArgs(args) {
  return args.map(arg => {
    if (typeof arg === 'object') {
      return util.inspect(arg, { depth: null, colors: true })
    }
    return arg
  })
}

export function createLogEntry(type, message, source) {
  return {
    timestamp: new Date().toISOString(),
    type,
    message,
    source,
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  }
}