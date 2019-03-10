import * as puppeteer from 'puppeteer'
import { FileManager } from '../../utils/file-manager';
import { TimeManager } from '../../utils/time-manager';
import { PromptManager, PromptColor } from '../../utils/prompt-manager';
import { GeneralError } from '../../utils/error-manager';

class PuppeteerManager {
    private browser: puppeteer.Browser;

    public async getPage() {
        this.browser = await puppeteer.launch();
        const page = await this.browser.newPage();
        return page
    };

    public async getImages(quantity: number, restriction: string){
        const page = await this.getPage();
        await page.goto("https://fakepersongenerator.com/Index/generate");
    
        let i = 0;
        let count = 0;
        const arrayOfLinks = FileManager.loadJson('images.json') as any[]
        
        while (i < quantity) {
            try {

                PromptManager.withSpace(2).printColorfulLog(`Image number:  ${i+1}`, PromptColor.WHITE)

                await page.select('.form-control', 'female')
                TimeManager.sleep(500);

                await page.click('#generate');
                await page.waitForSelector('.basic-face .face .img-responsive');

                const  imgSrc = await page.$eval('.basic-face .face .img-responsive', img => img.getAttribute('src'));
                PromptManager.withSpace().printColorfulLog(`Image Soruce:  ${imgSrc}`, PromptColor.WHITE).withSpace()

                if(imgSrc && imgSrc.indexOf(restriction) !== -1) {
                    const link = `https://fakepersongenerator.com${imgSrc}`
                    const foundObj = arrayOfLinks.find((obj: any) => {
                        return obj.link === link
                    })
                    PromptManager.consoleLog('Object Found: ', foundObj)

                    if(!foundObj) {
                        const objectToWrite = {
                            link,
                            selected: false
                        }
                        
                        PromptManager.consoleLog('Object to write: ', objectToWrite)
                        
                        arrayOfLinks.push(objectToWrite)
                        i++;

                        await FileManager.writeFile(arrayOfLinks, './images.json');
                    }
                }
                count++
            } catch (err) {
                PromptManager.withSpace().printColorfulLog(err, PromptColor.RED).withSpace()
                let error = new GeneralError()
                error.addedImages = i || 0
                error.totalImages = arrayOfLinks.length
                error.totalIteractions = count || 1

                if(err.message.toLowerCase().indexOf('timeout') !== -1) {
                    error.message = 'timeout'
                    
                } else if(err.message.indexOf('failed to find element matching') !== -1) {
                    error.message = 'matching'
                } else {
                    error.message = 'unknow error'
                }

                this.browser.close()
                throw error
            }
        }
        this.browser.close();
        return arrayOfLinks
    }

    public async closeBrowser() {
        this.browser.close();
    }

}

async function GetImageMain() {
    const timeManager = new TimeManager()
    timeManager.startCount()

    const puppeteerManager = new PuppeteerManager()

    const initialArrayOfLinks = FileManager.loadJson('images.json');
    const initialLength = initialArrayOfLinks.length;
   
    PromptManager.withSpace().printColorfulLog(`Starting with ${initialLength} images`, PromptColor.BLUE)
    try {
        await puppeteerManager.getImages(30, 'female');
    } catch (error) {
        TimeManager.sleep(5000)
        await MakeLogs(timeManager.finishCount().pretiffyTime, timeManager.finishCount().elapsedTime, error.totalImages, error.addedImages, error.totalIteractions)
        if(error.message === "timeout") {
            GetImageMain()
        } else if(error.message === "matching") {
            GetImageMain()
        } 
    }
}

async function MakeLogs(prettyTakenTime: string, takenTime: number, totalImages: number, addedImages: number, totalIteractions: number) {
    PromptManager.withSpace().printColorfulLog(`Stopping with ${totalImages} images`, PromptColor.GREEN)
    
    const loading = PromptManager.withSpace().loadingColorfulLog('Restarting', PromptColor.BLUE)
    PromptManager.stopLoading(loading);
    
    PromptManager.withSpace().printColorfulLog(`Taken time: ${prettyTakenTime} to add ${addedImages} `, PromptColor.BLUE)

    const successfullPorcentage = `${((addedImages/totalIteractions)*100).toFixed(2)}%`
    PromptManager.withSpace().printColorfulLog(`Successfull Porcentage: ${successfullPorcentage}`, PromptColor.BLUE).withSpace()
    
    const statisticsObject = {
        takenTime,
        addedImages,
        totalIteractions,
        successfullPorcentage,
        prettyTakenTime
    }

    const statistics = FileManager.loadJson('./get-image-statistics.json')
    statistics.push(statisticsObject)
    await FileManager.writeFile(statistics, './get-image-statistics.json')
    return
}

GetImageMain()