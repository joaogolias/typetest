function generateBio() {
    let finalString = ""
    let arr = []
    if(false){
        arr = ['Pouco tempo em São Paulo', 'Se demorar para responder é porque entro pouco aqui', 'Quem se descreve se limita', 'Procurando novas amizades']
        finalString+=getRandomValueFromArray(arr)
    } else {
        if(randomBoolean()) {
            arr = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA' , 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SE', 'TO']
            if(randomBoolean()) {
                const fValue = getRandomValueFromArray(arr)
                finalString += `De ${fValue} para `
            }
            finalString+='SP'
    
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
            arr = ['viagens', 'fotografia', 'musica', 'netflix', 'cachorros', 'gatos', 'praia', 'café', 'você']
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
                    finalString+=", "
                } 
                currentValue = getRandomValueFromArray(arr, previousValue)
                while(previousValue.find(v => v === currentValue)) {
                    currentValue = getRandomValueFromArray(arr)
                }
                finalString+=`${currentValue}`
                previousValue.push(currentValue)
                i++
            }
        }
        if(randomBoolean()){
            finalString+=" \nAltura: "
            finalString+=(Math.random()*(1.75 - 1.50) + 1.50).toFixed(2).toString()
        }
        if(randomBoolean()){
            arr = ['f1', 'litrao', 'comer um hamburguer']
            finalString+=' \n'
            finalString+= 'Me chame para '
            finalString+=getRandomValueFromArray(arr)
        }
        if(randomBoolean()){
            arr = ['São Judas', 'Uninove', 'Unip', 'UAM', 'FAM - Faculdade das Americas', 'PUC', 'FAAP', 'FATEC', 'FGV - Fundação Getulio Vargas', 'Escola Superior de Propaganda e Marketing', 'Mackenzie Presbiterian University', 'IMT - Instituo Maua de Tecnologia']
            finalString+=' \n'
            finalString+=getRandomValueFromArray(arr)
        }
        if(randomBoolean()){
            arr = ['Se você votou nele, nem vem', 'Bolsominios caiam fora', 'A procura de alguém para me fazer desistalar o tinder', 'Deixa sua mãe me chamar de loira', 'Procurando amigos', 'Nem vem pedindo foto', 'Me dê match', 'Dei Superlike foi sem querer', 'Eu sou feia mas meu olho é verde', 'Se não para chamar ']
            finalString+=' \n'
            finalString+=getRandomValueFromArray(arr)
        }
    }
    const splitFinalString = finalString.split('\n')
    finalString = ''
    let i = 0
    let splitFinalLength = splitFinalString.length
    while (i < splitFinalLength){
        if(i===0) {
            finalString += splitFinalString[i]
            splitFinalString.splice(splitFinalString[i], 1);
        }
        else {
            let r = Math.floor(Math.random()*(splitFinalString.length-1))
            let word = splitFinalString[r]
            if(word != undefined) {
                splitFinalString.splice(r, 1);
                finalString+=`\n${word}`
            }
        }
        i++
    }
    console.log(finalString)    
    return finalString
}

let k = 0

function randomBoolean() {
    return true
}

function getRandomValueFromArray(arr, skipValue=null) {
    let index = Math.floor(Math.random()*arr.length)
    while(!(arr[index] !== skipValue)) {
        index = Math.floor(Math.random()*arr.length)
    }
    return arr[index]
}



while(k <10) {
    generateBio()
    console.log("\n\n\n")
    k++
}