import * as fs from 'fs'
import { PromptManager, PromptColor } from './prompt-manager';

export class FileManager {
    public static rightDirName = __dirname.replace("build/", "").replace('utils', '')

    public static async writeFile(infos: any, fileName: string) {

        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, JSON.stringify(infos), (err) => {
                if (err) console.log(err)
                else PromptManager.withSpace().printColorfulLog(`File ${fileName} written`, PromptColor.BLUE)
                resolve()
            })
        })
    }

    public static loadJson(path: string): any {
        const obj = require(`${this.rightDirName}${path}`);
        return obj
    }
}