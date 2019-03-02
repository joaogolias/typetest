const uuid = require('uuid')

function jenGeneratior(quantity) {
    let i = 0
    const arr = []
    while(i<quantity) {
        console.log(`JEN ${i+1}: `)
        const id = uuid.v4().replace(/-/g, '')
        const _id = id
        const jen = {
            seen: {
                match_seen: true
            },
            _id,
            id,
            closed: randomBoolean(),
            common_friend_count: Math.floor(Math.random()*60),
            common_like_count: Math.floor(Math.random()*20),
            created_date: generateRandomDate(),
            dead: randomBoolean(),
            message_count: Math.floor(Math.random()*5+5),
            messages: [],
            muted: false,
            participants: [id.substring(0, id.length/2)],
            pending: randomBoolean(),
            is_super_like: false,
            is_boost_match: false,
            is_fast_match: false,
            person: {
                _id: _id.substring(0, id.length/2) + uuid.v4().replace(/-/g, '').substring(0, 6),
                name: getName(),
                bio:  generateBio(),
                birth_date:  generateRandomDate(1996, 3),
                gender: 1,
                ping_time: generateRandomDate(2014, 0, true),
                photos: generatePhotos(Math.floor(Math.random()*2)+1),
            },
            following: randomBoolean(),
            following_moments: randomBoolean()
        }
        console.log(jen)
        arr.push(jen)
        console.log("\n\n\n")
        i++
    }
    return arr
}

function generateRandomDate(startYear = 2015, yearStep = 2, setTimeZero = false) {
    const year = Math.floor(Math.random()*yearStep) + startYear
    const month = Math.floor(Math.random()*11) + 1
    const date = Math.floor(Math.random()*26) + 1
    const hour = Math.floor(Math.random()*23) + 1
    const minute = Math.floor(Math.random()*59) + 10
    const second = Math.floor(Math.random()*419) + 340
    return `${year}-${month < 10 ? "0" + month : month}-${date < 10 ? "0" + date : date}` +
        'T'+
        `${setTimeZero ? "00" : (hour < 10 ? "0" + hour : hour)}:${setTimeZero ? "00" : minute}:${setTimeZero ? "00" : second}Z`
}

function generateBio() {
    let finalString = ""
    let arr = []
    if(randomBoolean()) {
        arr = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA' , 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SE', 'TO']
        const fValue = getRandomValueFromArray(arr)
        finalString += `De ${fValue}`
        if(randomBoolean()) {
            const sValue = getRandomValueFromArray(arr, fValue)
            finalString += ` para ${sValue}`
        }
    }
    if(randomBoolean()) {
        arr = ['ZN', 'ZL', 'ZS', 'ZO']
        finalString+=' \n'
        finalString+=getRandomValueFromArray(arr)
    }
    if(randomBoolean()){
        arr = ['Corithiana', 'Sao Paulina', 'Palmeirense', 'Flamenguista']
        finalString+=' \n'
        finalString+=getRandomValueFromArray(arr)

    }
    if(randomBoolean()){
        arr = ['Ariana', 'Tourina', 'Geminiana', 'Canceriana', 'Leonina', 'Virginiana', 'Libriana', 'Escorpiana', 'Sagitariana', 'Capricorniana', 'Aquariana', 'Pisciana']
        finalString+=' \n'
        finalString+=getRandomValueFromArray(arr)
    }
    if(randomBoolean()){
        arr = ['viagens', 'fotografia', 'musica', 'netflix', 'cachorros', 'gatos', 'praia']
        finalString+=' \n'
        // const randomLoves = Math.floor(Math.random()*3)
        const randomLoves = 3
        let i = 0
        let currentValue
        let previousValue = []
        while(i < randomLoves) {
            if(i==0){
                finalString+="Apaixonada por"
            } else if(i == randomLoves - 1) {
                finalString+=" e "
            } else if(i != randomLoves) {
                finalString+=","
            } 
            currentValue = getRandomValueFromArray(arr, previousValue)
            while(previousValue.find(v => v === currentValue)) {
                currentValue = getRandomValueFromArray(arr)
            }
            finalString+=` ${currentValue}`
            previousValue.push(currentValue)
            i++
        }
    }
    if(randomBoolean()){
        finalString+=" \nAltura: "
        finalString+=(Math.random()*(1.75 - 1.50) + 1.50).toFixed(2).toString()
    }
    if(randomBoolean()){
        arr = ['F1', 'Litrao', 'Comer um Hamburguer']
        finalString+=' \n'
        finalString+= 'Me chame para '
        finalString+=getRandomValueFromArray(arr)
    }
    if(randomBoolean()){
        arr = ['São Judas', 'Uninove', 'Unip', 'UAM', 'FAM - Faculdade das Americas', 'PUC', 'FAAP', 'FATEC', 'FGV - Fundação Getulio Vargas', 'Escola Superior de Propaganda e Marketing', 'Mackenzie Presbiterian University', 'IMT - Instituo Maua de Tecnologia']
        finalString+=' \n'
        finalString+=getRandomValueFromArray(arr)
    }
    console.log(finalString)
    return finalString
}

function getRandomValueFromArray(arr, skipValue=null) {
    let index = Math.floor(Math.random()*arr.length)
    while(!(arr[index] !== skipValue)) {
        index = Math.floor(Math.random()*arr.length)
    }
    return arr[index]
}




function getName() {
    const jens = ['Jeniffer', 'Jhenyfer', 'Jenyfer',  'Jenyfher', 'Dienifer', 'Genifer', 'Jenifer', 'Jenyfer', 'Genyfer']
    const middleNames = ['B.', 'M.', 'R.', 'J.', 'L.', 'P.','T.', 'Y.' ]
    const lastNames = ['Souza', 'Silva', 'Camargos', 'Santos', 'Ishiara', 'Carvalho', 'Mendes', 'Rodrigues', 'Oliveira', 'Ferreira', 'Lima', 'Pereira']

    const name = getRandomValueFromArray(jens)
    let middleName = ''
    if(randomBoolean()) middleName = getRandomValueFromArray(middleNames)
    const lastName = getRandomValueFromArray(lastNames)

    if(middleName !== '') {
        return `${name} ${middleName} ${lastName}`
    }
    return `${name} ${lastName}`
}


function generatePhotos(numberOfPhotos = 1) {
    let i = 0
    const arr = []
    const url = generatePhotoUrl()
    const id = uuid.v4()
    console.log("PHOTOS:")
    while(i < numberOfPhotos) {
        const photo = {
            id,
            url,
            processedFiles: [{
                url,
                height: 640,
                width: 640
            }, {
                url,
                height: 320,
                width: 320
            },
            {
                url,
                height: 172,
                width: 172
            },
            {
                url,
                height: 84,
                width: 84
            }],
            fileName: `${id}.jpg`,
            extension: "jpg"
        }
        console.log(photo)
        arr.push(photo)
        i++
    }
    return arr
}

function generatePhotoUrl() {
    return 'https://www.google.com'
}

function randomBoolean() {
    return Math.random() > 0.5
    // return true
}


console.log(JSON.stringify(jenGeneratior(20)))
