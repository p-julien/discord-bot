export class Logger {
    
    static info(message) {
        const datetime = new Date().toLocaleString()
        console.log(`[${datetime}] ${message}`)
    }

    static error(error) {
        const datetime = new Date().toLocaleString()
        if (error.stack === undefined)
            return console.error(`[${datetime}] ${error}`)
            
        console.error(`[${datetime}] ${error.stack}`)
    }
}