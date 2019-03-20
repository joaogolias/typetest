const axios = require('axios');

var http = require("https");
var fs = require("fs");
var results = []
var possibleNums = ["01", "12", "17", "18", "37", "14", "40", "20", "06", "k", "0", "23", "31", "12", "35", "34", "27", "33", "39", "43", "24", "41", "42", "M", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "a", 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']
const arr1 = ["01", "12", "17", "18", "37", "14", "40", "20", "06", "k", "0", "23", "31", "12", "35", "34", "27", "33", "39", "43", "24", "41", "42", "m", "19", "02", "21", "13"]
const arr2 = ["01", "20", "a", "02", "04", "16", "19", "18", "15", "26", "j", "31", "17", "04", "12", "36", "40", "35", "37", "m", "0", "c", "34", "27", "k", "d", "06", "p", "13","04", "03"]
var arr3 = ["31", "41", "42", "36", "34", "32", "37", "09", "14", "13", "j", "16", "26","22", "27", "20", "n", "40", "24", "41", "42", "43", "44", "12", "06", "14", "k", "03"]
var arr4 = ["01", "02", "03", "04", "05", "07", "08", "12", "11", "13", "14", "15", "29", "38", "39", "48", "47", "46", "44", "g", "h", "b", "c", "d", "e", "f", "m", "20","27", "24", "43","36","22", "33", "a",  "m"]

var count = 0;

const request = async (path) => {
    try {
        var options = {
            "method": "GET",
            "hostname": "harakirimail.com",
            "port": null,
            "path": `/api/v1/inbox/${path}`,
            "headers": {
              "cache-control": "no-cache",
              "postman-token": "cfd2c39a-34eb-4c37-d543-8321d3badfe7"
            }
          };

        return new Promise((resolve, rej) => {
            try {
                var req = http.request(options, function (res) {
                    try {

                        var chunks = [];
            
                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        });
                
                        res.on("end", function () {
                            var body = Buffer.concat(chunks);
                            resolve(checkText(body.toString(), path));
                        });
    
                        
                        
                    } catch (err) {
                        console.log("deu erro 123: ", err.message)
                    }
                })
                   
                
                req.end()
            } catch(err) {
                console.log('deu erro: ', err.message)
                // rej(err)

            }
                
        }) 
    } catch(err) {
        console.log('deu erro')
        sleep(500)
        request(path)
    }
}

function checkText(data, path) {
    var result = parseInt(data[data.indexOf('total_count')+14]) > 0
    if (result) {
        console.log(path)
    }
    return {
        path,
        result,
    }
}

async function writeFile(items) {
    var finalStr = ""
    for(var item of items) {
        if(item.result) {
            finalStr+=item.path + '\n'
        }
    }
    return new Promise((resolve, reject) => {
        fs.writeFile("results.txt", finalStr, (err) => {
            if (err) console.log(err)
            else console.log(`File results.txt written`)
            resolve()
        })
    })
}

async function main() {
    try {
        const blabla = await request("teste")
        console.log("initial request: :", blabla)
        results.push(blabla)
    
        await executeForArray(possibleNums, async (teste) => {
            const lala = teste.join('')
            var req = request(lala)
            return req
        })
        await writeFile(results)
    } catch (err) {

    }
}

async function executeForArray(arr, cb) {
    try {
        var i = 0;
        let promisesArr = []
        for (let a = 0; a < arr.length; a++) {
            for (let b = 0; b < arr.length; b++) {
                for (let c = 0; c < arr.length; c++) {
                    for (let d = 0; d < arr.length; d++) {
                        const current = []
                        current.push(arr[a])
                        current.push(arr[b])
                        current.push(arr[c])
                        current.push(arr[d])
                        if(isAllUnique(current)) {
                            if(i < 100) {
                                promisesArr.push(cb(current))
                                i++
                            } else {
                                console.log(results.length)
                                const newResults = await Promise.all(promisesArr)
                                promisesArr = []
                                results = results.concat(newResults)
                                i = 0
                            }
                        } 
                    }
                }
            }
        }
    } catch (err) {
        console.log("bbjnklm,;")
        console.log(err)
    }

}

function isAllUnique(arr) {
    for (let i = 0; i < arr.length; i++) {
        const index = arr.indexOf(arr[i])
        if (index > -1 && index !== i) {
            return false
        }
    }
    return true
}

function sleep(miliseconds) {
    const start = new Date().getTime();
    for(let i = 0; i < 1e12; i++) {
        if((new Date().getTime() - start) > miliseconds) {
            break;
        }
    }
}

main()

