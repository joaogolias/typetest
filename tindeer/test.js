const test = require('../images.json')
console.log('test: ', test);

for(const k of test) {
    k.selected = true;
}

console.log(test);