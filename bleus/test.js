// const test = require('../images.json')
// console.log('test: ', test);

// for(const k of test) {
//     k.selected = true;
// }

// console.log(test);

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
            console.log('hahaha');
            clearTimeout(timeout);        
        break;
      }
    }
}

function TimeoutCallback(...args) {
    console.log('lalala');
    console.log(args);
}

const timeout = setTimeout(TimeoutCallback, 100)

sleep(5000)

const user = {
    name: "favela",
    college: "poli",
    dps: ['sd2', 'cir2']
};







