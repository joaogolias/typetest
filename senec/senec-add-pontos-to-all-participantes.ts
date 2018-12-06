import * as firebase from 'firebase'

// senec-dev
// const config = {
//     apiKey: "AIzaSyB3UI0l-u2cP5PCzOBtnWB8f8u7361W7Vw",
//     authDomain: "senec-dev.firebaseapp.com",
//     databaseURL: "https://senec-dev.firebaseio.com",
//     storageBucket: "senec-dev.appspot.com",  
// }


// senec-app
const config = {
    apiKey: "AIzaSyCXPcDPKSlZRJXI-K8dSjuoAof-HjyIAM0",
    authDomain: "senec-app.firebaseapp.com",
    databaseURL: "https://senec-app.firebaseio.com",
    storageBucket: "senec-app.appspot.com",  
}

const main = async () => {
    firebase.initializeApp(config)

    const allParticipants = await getAllParticipants()

    var x = 0 

    let arrayDeParticipantes: any[] = []

    // for(const item in allParticipants) {
    //     // if(allParticipants[item].pontos === undefined || allParticipants[item].pontos === null){
    //     //     x++
    //     //     allParticipants[item]['pontos'] = 0
    //     // }
    //     arrayDeParticipantes.push(allParticipants[item])
    // }

    // let newArray = arrayDeParticipantes.filter(
    //     (iten) => iten.pontos === undefined || iten.pontos === null
    // )

    // console.log('newArray: ', newArray)
    // console.log('tamanho de newArray: ', newArray.length)
    
    for(const item in allParticipants) {
        if(allParticipants[item].pontos === undefined || allParticipants[item].pontos === null){
            x++
            allParticipants[item]['pontos'] = 0
        }
        arrayDeParticipantes.push(allParticipants[item])
    }

    const newArray = arrayDeParticipantes.filter(
        (iten) => iten.pontos === undefined || iten.pontos === null
    )

    console.log('newArray: ', newArray)
    console.log('tamanho de newArray: ', newArray.length)
    console.log('participante sem pontos: ', x)

    updateAllParticipants(allParticipants)
}

const getAllParticipants = async (): Promise<any[]> => {
    return new Promise<any>((resolve, reject) => {
        firebase.database()
            .ref('participantes')
            .on('value', (snapshot) => {
                if(!snapshot) {
                    throw new Error("No users found ")
                }
                resolve(snapshot.val())
            })
    })
}

const updateAllParticipants = async (participantes: any): Promise<void> => {
    firebase.database()
        .ref('participantes')
        .update(
            participantes, (err) => {
                console.log('err: ', err)
            }
        )
} 
main()