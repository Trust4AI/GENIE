type LogType = 'error' | 'warn' | 'info' | 'log'

const debugMode = process.env.DEBUG_MODE === 'true'

const debugLog = (message: string, type: LogType = 'log') => {
    if (debugMode) {
        switch (type) {
            case 'error':
                console.error(message)
                break
            case 'warn':
                console.warn(message)
                break
            case 'info':
                console.info(message)
                break
            default:
                console.log(message)
                break
        }
    }
}

export { debugLog }
