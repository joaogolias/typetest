import readlineLib = require('readline')
import { FileManager } from './file-manager';
// import { TimeManager } from './time-manager';

export enum PromptColor {
    GREEN = "\x1b[32m",
    BLUE = "\x1b[36m",
    RED = "\x1b[31m",
    YELLOW = "\x1b[33m",
    WHITE = "\x1b[0m",
    MAGNETA = "\x1b[35m"
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
            process.stdout.write('\n')
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

export class CustomLayouts {
    public static longerDivider(color = PromptColor.YELLOW) {
        PromptManager.withSpace().printColorfulLog("======================================================================", color).withSpace()
    }
    public static simpleDivider(color = PromptColor.WHITE) {
        PromptManager.withSpace().printColorfulLog("--------------------------------------------------", color)
    }
}

export class PrintFile {
    public static printJson(fileName: string, onlyLength = true) {
        const json = FileManager.loadJson(fileName)
        if(json instanceof Array) {
            PromptManager.printColorfulLog(`Length: ${json.length}`, PromptColor.WHITE)
            if(!onlyLength) PromptManager.printColorfulLog(JSON.stringify(json), PromptColor.WHITE)
        }
    }
}


async function main() {
    const fileName = await PromptManager.readline('Qual o nome do arquivo? ')
    const onlyLength = await PromptManager.readline('Se for array, só o tamanho? (1 - sim, 0 - não)')
    PrintFile.printJson(fileName, onlyLength === '1')
}

main()
// loadingColorfulLog("Ola", Color.BLUE)