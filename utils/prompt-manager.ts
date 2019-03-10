import readlineLib = require('readline')
// import { TimeManager } from './time-manager';

export enum PromptColor {
    GREEN = "\x1b[32m",
    BLUE = "\x1b[36m",
    RED = "\x1b[31m",
    WHITE = "\x1b[0m"
}

export enum Space {
    BEFORE, AFTER
}

export class PromptManager {
    private static rl = readlineLib.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    public static withSpace(quantity: number = 1) {
        for(let i = 0; i < quantity; i++) {
            console.log('\n')
        }
        return PromptManager
    }

    public static consoleLog(text: string, data: any) {
        console.log(text, data)
    }

    public static printColorfulLog(text: string, color: string) {
        process.stdout.write(`${color}${text}\x1b[0m`)
        return PromptManager
    }

    public static readline(value: string): Promise<string> {
        return new Promise<string>((res, rej) => {
            PromptManager.rl.question(value, function(answer) {
                res(answer)
          });
        })
    }

    public static loadingColorfulLog(text: string, color: string) {
        process.stdout.write(`${color}${text}`)
        let dotQuantity = 0
        return setInterval(() => {
            if(dotQuantity < 3) {
                process.stdout.write(".")
                dotQuantity++
            } else {
                readlineLib.clearLine(process.stdout, 0)
                process.stdout.write(`\r${color}${text}`)
                dotQuantity = 0
            }
        }, 250)
    }

    public static stopLoading(intervalId: NodeJS.Timeout) {
        clearInterval(intervalId)
        process.stdout.write('\x1b[0m')
    }
    
}

// loadingColorfulLog("Ola", Color.BLUE)