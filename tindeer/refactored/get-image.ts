import * as puppeteer from 'puppeteer'
import { FileManager } from '../../utils/file-manager';
import { TimeManager } from '../../utils/time-manager';
import { PromptManager, PromptColor } from '../../utils/prompt-manager';

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
        const arrayOfLinks = FileManager.readJson('images.json');
        
        while (i < quantity) {
            try {
                console.log('\n\n')
                console.log('Image number: ', i+1);

                await page.select('.form-control', 'female')
                TimeManager.sleep(500);

                await page.click('#generate');
                await page.waitForSelector('.basic-face .face .img-responsive');

                const  imgSrc = await page.$eval('.basic-face .face .img-responsive', img => img.getAttribute('src'));
                console.log(imgSrc);

                if(imgSrc && imgSrc.indexOf(restriction) !== -1) {
                    const link = `https://fakepersongenerator.com${imgSrc}`
                    const foundObj = arrayOfLinks.find((obj: any) => {
                        return obj.link === link
                    })
                    console.log('foundObj: ', foundObj)
                    if(!foundObj) {
                        console.log('object to write: ', {
                            link,
                            selected: false
                        });
                        arrayOfLinks.push({
                            link,
                            selected: false
                        })
                        i++;
                        await FileManager.writeFile(arrayOfLinks, './images.json');
                    }
                }
                // TimeManager.sleep(500);
            } catch (err) {
                console.log('Err in Puppeteer: ', err)
                if(err.message.toLowerCase().indexOf('timeout') !== -1) {
                    throw new Error('timeout'); 
                } else if(err.message.indexOf('failed to find element matching') !== -1) {
                    throw new Error('matching'); 
                }
                this.browser.close();
                break;
            }
        }

        console.log('COUNT: ', count);
        console.log('QUANTITY: ', quantity);
        this.browser.close();
        return arrayOfLinks
    }

    public async closeBrowser() {
        this.browser.close();
    }

}

async function GetImageMain() {
    const puppeteerManager = new PuppeteerManager()
    const date = new Date().getTime()
    const initialArrayOfLinks = FileManager.readJson('images.json');
    const initialLength = initialArrayOfLinks.length;
    PromptManager.printColorfulLog(`Starting with ${initialLength} images`, PromptColor.BLUE)
    try {
        const arrayOfPhotos = await puppeteerManager.getImages(15, 'female');
        PromptManager.printColorfulLog(`Stopping with ${arrayOfPhotos.length} images`, PromptColor.GREEN)
        const finishedDate = new Date().getTime();
        PromptManager.printColorfulLog(`Taken time: ${TimeManager.pretiffyTime(finishedDate - date)} to add ${arrayOfPhotos.length - initialLength} `, PromptColor.BLUE)
    } catch (error) {
        if(error.message === "timeout") {
            PromptManager.printColorfulLog('Timeout Error', PromptColor.RED)
            console.log('\n')
            const arrayOfLinks = FileManager.readJson('images.json');
            PromptManager.printColorfulLog(`Stopping with ${arrayOfLinks.length} images`, PromptColor.GREEN)
            console.log('\n')
            const loading = PromptManager.loadingColorfulLog('Restarting', PromptColor.BLUE)
            console.log('\n')
            TimeManager.sleep(5000)
            console.log('hahaha')
            PromptManager.stopLoading(loading);
            const finishedDate = new Date().getTime();
                        PromptManager.printColorfulLog(`Taken time: ${TimeManager.pretiffyTime(finishedDate - date)} to add ${arrayOfLinks.length - initialLength} `, PromptColor.BLUE)
            GetImageMain()
        } else if(error.message === "matching") {
            PromptManager.printColorfulLog('Matching Error', PromptColor.RED)
            console.log('\n')
            const arrayOfLinks = FileManager.readJson('images.json');
            PromptManager.printColorfulLog(`Stopping with ${arrayOfLinks.length} images`, PromptColor.GREEN)
            console.log('\n')
            const loading = PromptManager.loadingColorfulLog('Restarting', PromptColor.BLUE)
            console.log('\n')
            TimeManager.sleep(5000)
            PromptManager.stopLoading(loading);
            const finishedDate = new Date().getTime();
                        PromptManager.printColorfulLog(`Taken time: ${TimeManager.pretiffyTime(finishedDate - date)} to add ${arrayOfLinks.length - initialLength} `, PromptColor.BLUE)
            GetImageMain()
        } else {
            const arrayOfLinks = FileManager.readJson('images.json');
            const finishedDate = new Date().getTime();
            PromptManager.printColorfulLog(`Taken time: ${TimeManager.pretiffyTime(finishedDate - date)} to add ${arrayOfLinks.length - initialLength} `, PromptColor.BLUE)
            puppeteerManager.closeBrowser()
        }
    }
}

GetImageMain()