import config from '../config/config'
import { LogType } from '../types'

const debugMode: boolean = config.debugMode

const debugLog = (message: string, type: LogType = 'log'): void => {
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
