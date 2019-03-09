// import * as puppeteer from 'puppeteer';
const puppeteer = require('puppeteer');
const fs = require('fs');

let browser;

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
    const arrayOfLinks = [];
    while (i < quantity) {
        console.log(i);
        await page.click('#generate');
        await page.waitForSelector('.basic-face .face .img-responsive');
        const  imgSrc = await page.$eval('.basic-face .face .img-responsive', img => img.getAttribute('src'));
        if(imgSrc.indexOf(restriction) !== -1) {
            console.log(`https://fakepersongenerator.com${imgSrc}`);
            arrayOfLinks.push({
                link: `https://fakepersongenerator.com${imgSrc}`, 
                selected: false
            })
            i++;
        }
        count++;
        sleep(1000);
        console.log('imgSrc: ', imgSrc);
    }
    console.log('COUNT: ', count);
    console.log('QUANTITY: ', quantity);
    return arrayOfLinks
}

const writeFile = async (infos, fileName) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(infos), (err) => {
            if (err) console.log(err)
        })
    })
}


const main = async () => {
    const arrayOfPhotos = await getImages('.basic-face .face .img-responsive', 5, 'female');
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
} catch (err) {
    browser.close();
}

