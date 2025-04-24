/**
 * Logger utility class to output formatted console logs with contextual origin and log levels.
 */
class Logger {
    private origin: string;

    /**
     * Create a new Logger instance.
     * @param origin - Identifier to indicate the source of the logs (e.g., module name).
     */
    constructor(origin: string) {
        this.origin = origin;
    }

    private gray(text: string): string {
        return `\x1b[90m${text}\x1b[0m`;
    }

    private cyan(text: string): string {
        return `\x1b[36m${text}\x1b[0m`;
    }

    private green(text: string): string {
        return `\x1b[32m${text}\x1b[0m`;
    }

    private yellow(text: string): string {
        return `\x1b[33m${text}\x1b[0m`;
    }

    private red(text: string): string {
        return `\x1b[31m${text}\x1b[0m`;
    }

    private timestamp(): string {
        return this.gray(new Date().toLocaleString());
    }

    /**
     * Log an informational message to the console.
     * @param args - The arg(s) to log.
     */
    info(...args: any[]): void {
        console.log(`${this.timestamp()} [${(this.origin)}] ${this.cyan(`[INFO]`)}`, ...args);
    }

    /**
     * Log a success message to the console.
     * @param args - The arg(s) to log.
     */
    success(...args: any[]): void {
        console.log(`${this.timestamp()} [${(this.origin)}] ${this.green(`[SUCCESS]`)}`, ...args);
    }

    /**
     * Log a warning message to the console.
     * @param args - The arg(s) to log.
     */
    warn(...args: any[]): void {
        console.warn(`${this.timestamp()} [${(this.origin)}] ${this.yellow(`[WARN]`)}`, ...args);
    }

    /**
     * Log an error message to the console.
     * @param args - The arg(s) to log.
     */
    error(...args: any[]): void {
        console.error(`${this.timestamp()} [${(this.origin)}] ${this.red(`[ERROR]`)}`, ...args);
    }
}

export default Logger;
