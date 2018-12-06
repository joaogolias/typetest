import * as firebase from 'firebase'
import * as fs from 'fs'

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


/**************************/
/* CRIAR PASTA documentos */
/**************************/
const activityId = '-LLbgA4pzWi7pvRyGPa9'
const emailsFileName = 'unity-3d-tfg-mala-direta.txt'
const emailsAndNamesFileName = 'unity-3d-tfg-participantes.txt'
const emailsAndNamesTitle = 'TFG - UNITY 3D VIRTUAL - PARTICIPANTES'


const main = async () => {
    firebase.initializeApp(config)
   
    const subscriptions = await getSubscriptionsByActivityId(activityId)
    
    const participantsIds: string[] = []
    for(const item in subscriptions) {
        participantsIds.push(subscriptions[item].participanteId)
    }
    
    const allParticipants = await getAllParticipants()

    const activityParticipants: any[] = []
    for(const item in allParticipants) {
        if(participantsIds.indexOf(item) !== -1) {
            activityParticipants.push(allParticipants[item])
        }
    }
    
    const participantEmailAndName = activityParticipants.map(
        (participant) => ({
            nome: participant.nome,
            email:participant.email,
            cpf: participant.cpf,
        }))

    const participantesEmail = activityParticipants.map(
        (participant) => participant.email)

    writeTxtFileEmails(participantesEmail, `documentos/${emailsFileName}`)

    writeTxtFileEmailAndName(
        participantEmailAndName, 
        `documentos/${emailsAndNamesFileName}`, 
        emailsAndNamesTitle)
}

const writeTxtFileEmailAndName = (participants: any[], fileName: string, title?: string): void => {
    console.log('\nEscrevendo arquivos de participantes...')

    participants = participants.sort(
        (partA, partB) => {
            if(partA.name > partB.name) {
                return 1
            } else {
                return -1
            }
        }
    )
    
    let textToSave = title || ''

    participants.forEach(
        (part, index) => {
            const partialText = `
Participante ${index+1}:
    NOME: ${part.nome}
    EMAIL: ${part.email}
    CPF: ${part.cpf}`
            textToSave = textToSave + partialText
        }
    )

    console.log(textToSave)

    fs.writeFile(fileName, textToSave, (err: Error) => {
        if (err) console.log(err)
    })
    console.log('Arquivo finalizado!')

}


const writeTxtFileEmails = (emails: string[], fileName: string): void => {
    console.log('\nEscrevendo arquivos de email...')

    emails = emails.sort(
        (emailA, emailB) => {
            if(emailA > emailB) {
                return 1
            } else {
                return -1
            }
        }
    )

    const emailsToWrite = emails.reduce((acc, newValue) => {
        return acc + '\n' + newValue
    })

    fs.writeFile(fileName, emailsToWrite, (err: Error) => {
        if (err) console.log(err)
    })

    console.log('Arquivo finalizado!')
}

const getSubscriptionsByActivityId = async (activityId: string): Promise<any> => {
    console.log('Baixando inscrições dessa atividade...')
    return new Promise<any>((resolve, reject) => {
        firebase.database()
            .ref('inscricoes')
            .orderByChild("atividadeId")
            .equalTo(activityId)
            .on('value',(snapshot) => {
                if(!snapshot) {
                    throw new Error("No subscriptions found ")
                }
                resolve(snapshot.val())
            })
    })
}

const getAllParticipants = async (): Promise<any> => {
    console.log('\nBaixando os participantes...')
    const participants = await new Promise<any>((resolve, reject) => {
        firebase.database()
            .ref('participantes')
            .on('value', (snapshot) => {
                if(!snapshot) {
                    throw new Error("No users found ")
                }
                resolve(snapshot.val())
            })
    })
    console.log('Participantes baixados!')

    return participants
}

main()