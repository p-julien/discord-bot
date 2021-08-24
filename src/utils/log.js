export class Logger {
    
    info(message) {
        const datetime = new Date().toLocaleString()
        console.log(`[${datetime}] ${message}`)
    }

    error(error) {
        const datetime = new Date().toLocaleString()
        console.error(`[${datetime}] ${error}`)
    }
}