// import * as puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');
const array = require('../images.json');
console.log('array initial size: ', array.length);
let browser;

let timeout;
let timeoutCleared = false;
let hadError = false;
let timeoutCallback = (args) => {
    console.log('timeout')
    console.log('args: ', args)
    main()
    sleep(10000);
    clearTimeout(timeout);
    timeoutCleared = true;
}
timeout = setTimeout(timeoutCallback, 10000)
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }


const getPage = async () => {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    return page
};

const getImages = async (selector, quantity, restriction) => {
    const page = await getPage();
    await page.goto("https://fakepersongenerator.com/Index/generate");

    let i = 0;
    let count = 0;
    const arrayOfLinks = array;
    while (i < quantity) {
        try {
            if(timeoutCleared) {
                timeout = setTimeout(timeoutCallback, 10000);
                break;
            }
            console.log('INITIALIZING');
            await page.select('.form-control', 'female')
            sleep(500);
            await page.click('#generate');
            await page.waitForSelector('.basic-face .face .img-responsive');
            const  imgSrc = await page.$eval('.basic-face .face .img-responsive', img => img.getAttribute('src'));
            console.log(imgSrc);
            if(imgSrc.indexOf(restriction) !== -1) {
                const link = `https://fakepersongenerator.com${imgSrc}`
                const foundObj = array.find((obj) => {
                    return obj.link === link
                })
                console.log('foundObj: ', foundObj)
                if(!foundObj) {
                    console.log(i);
                    console.log(link);
                    arrayOfLinks.push({
                        link,
                        selected: false
                    })
                    i++;
                    await writeFile(arrayOfLinks, './images.json');
                }
            }
            count++;
            clearTimeout(timeout);
            sleep(1000);
        } catch (err) {
            sleep(20000)
            break;
        }
    }
    if(hadError) {
        return;
    }
    console.log('COUNT: ', count);
    console.log('QUANTITY: ', quantity);
    return arrayOfLinks
}

const writeFile = async (infos, fileName) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(infos), (err) => {
            if (err) console.log(err)
            else console.log('CHECK')
        })
        resolve()
    })
}


async function main () {
    const arrayOfPhotos = await getImages('.basic-face .face .img-responsive', 30, 'female');
    if(hadError) {
        return;
    }
    console.log('\n\n');
    console.log('array final size: ', arrayOfPhotos.length);
    await writeFile(arrayOfPhotos, './images.json');
    browser.close();
    // const page = await getPage();
    // await page.goto("https://fakepersongenerator.com/Index/generate");

    // await page.click('#generate');


    // await page.waitForSelector('.basic-face .face .img-responsive');
    // const getImgSrc = await page.$eval('.basic-face .face .img-responsive', img => img.getAttribute('src'));
    // console.log('getImgSrc: ', getImgSrc);
}

try {
    main();
    if(hadError) {
        sleep(20000)
        main()
    }
} catch (err) {
    if(err.message.indexOf('failed to find element matching') !== -1) {
        sleep(15000);
        main();
    }
    else {
        
        browser.close();        
    }
}

