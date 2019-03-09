const uuid = require('uuid')
const fs = require('fs')
function jenGenerator(quantity) {
    let i = 0
    const machArr = []
    const profArr = []
    while(i<quantity) {
        const id = uuid.v4().replace(/-/g, '')
        const _id = id
        const birth_date = generateRandomDate(1996, 3)
        const name = getName()
        const photos = generatePhotos()
        const gender = 1
        const ping_time = generateRandomDate(2014, 0, true)
        const arr = ['São Judas', 'Uninove', 'Unip', 'UAM', 'FAM - Faculdade das Americas', 'PUC', 'FAAP', 'FATEC', 'FGV - Fundação Getulio Vargas', 'Escola Superior de Propaganda e Marketing', 'Mackenzie Presbiterian University', 'IMT - Instituo Maua de Tecnologia']
        const school = getRandomValueFromArray(arr)
        profArr.push(generateProfile(_id, birth_date, name, school, photos, gender, ping_time))
        machArr.push(generateMatch(_id, birth_date, name, school, photos, gender, ping_time))
        i++
    }
    fs.writeFile('./profiles.json', JSON.stringify(profArr), (err) => {
        if (err) console.log(err)
    })
    fs.writeFile('./matches.json', JSON.stringify(machArr), (err) => {
        if (err) console.log(err)
    })
    // console.log(profArr)
    // console.log("\n\n\n\n\n")
    // console.log(machArr)
}

function generateProfile(_id, birth_date, name, school, photos, gender, ping_time) {
    const schools = []
    schools.push(school)
    const prof = {
        status: 200,
        results: {
            connection_count: Math.floor(Math.random()*5),
            common_interests: [],
            _id,
            birth_date,
            name,
            ping_time,
            photos,
            schools,
            gender,
            birth_date_info: "fuzzy birthdate active, not displaying real birth_date",
            distance_mi: Math.floor(Math.random()*5),
            jobs:[],
            common_connections:[],
            is_tinder_u:false
        }
    }
    return prof
}


function generateMatch(_id, birth_date, name, school, photos, gender, ping_time) {
    const id = _id
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
            name,
            bio:  generateBio(school),
            birth_date,
            gender,
            ping_time,
            photos: photos.map((i) => ({
                id: i.id,
                url: i.url,
                processedFiles: i.processedFiles,
                fileName: i.fileName,
                extension: i.extension
            })),
        },
        following: randomBoolean(),
        following_moments: randomBoolean()
    }

    // console.log('jen: ')
    // console.log(jen)
    console.log(jen.person.photos);
    return jen
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

function generateBio(school) {
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
        finalString+=` \n${getRandomValueFromArray(arr)}`
    }
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
            extension: "jpg",
            crop_info:{  
                user:{  
                   width_pct:1,
                   x_offset_pct:0,
                   height_pct:1,
                   y_offset_pct:0
                },
                algo:{  
                   width_pct: Math.random()*0.5234094811209384098,
                   x_offset_pct: Math.random()*0.5234094811209384098,
                   height_pct: Math.random()*0.5234094811209384098,
                   y_offset_pct: Math.random()*0.5234094811209384098
                },
                processed_by_bullseye:true,
                user_customized:false
             }
        }
        arr.push(photo)
        i++
    }
    return arr
}

function generatePhotoUrl() {
    const images = require('../images.json')
    const filteredImages = images.filter((obj) => obj.selected === false);
    const seletectedObject = filteredImages[Math.floor(Math.random()*(filteredImages.length-1))]
    seletectedObject.selected = true;
    return seletectedObject.link;
}

function randomBoolean() {
    return Math.random() > 0.5
    // return true
}

jenGenerator(5)
