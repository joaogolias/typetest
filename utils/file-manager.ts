import * as fs from 'fs'

export class FileManager {
    public static rightDirName = __dirname.replace("build/", "").replace('utils', '')

    public static async writeFile(infos: any, fileName: string) {

        return new Promise((resolve, reject) => {
            fs.writeFile(fileName, JSON.stringify(infos), (err) => {
                if (err) console.log(err)
                else console.log('File written')
                resolve()
            })
        })
    }

    public static readJson(path: string): any {
        const obj = require(`${this.rightDirName}${path}`);
        return obj
    }
}