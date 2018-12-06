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

const getAllActivities = async () => {
    const activities = await new Promise<any>((resolve, reject) => {
        firebase.database()
            .ref('atividades')
            .on('value', (snapshot) => {
                if(!snapshot) {
                    throw new Error("No users found ")
                }
                resolve(snapshot.val())
            })
    })

    const activitiesArray = []
    for(const key in activities) {
        const activity = {
            id: key,
            ...activities[key],
            date: Date.parse(activities[key].inicioAtividade)
        }
        activitiesArray.push(activity)
    }

    return activitiesArray
}

const filterTodayActivitiesIds = (activities: any[]) => {
    const filteredActitivies = activities
                .filter(
                    (act) => {
                        const today = (new Date()).setHours(0,0,0,0)
                        const actDate = (new Date(act.date)).setHours(0,0,0,0)
                        return today === actDate
                    }
                )
    console.log("filteredActitivies: ", filteredActitivies)
    return filteredActitivies
            .map((act) => act.id)
}

const getAllFeedbacks = async () => {
    const feedBacks = await new Promise<any>((resolve, reject) => {
        firebase.database()
            .ref('polls')
            .on('value', (snapshot) => {
                if(!snapshot) {
                    throw new Error("No users found ")
                }
                resolve(snapshot.val())
            })
    })

    const feedbackArray = []
    for(const key in feedBacks) {
        const activity = {
            activityId: key,
            ...feedBacks[key],
        }
        feedbackArray.push(activity)
    }

    return feedbackArray
}

const getAllParticipants = async (): Promise<any> => {
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

const writeTxtFileEmailAndName = (participants: any[], fileName: string): void => {
    participants = participants.sort(
        (partA, partB) => {
            if(partA.name > partB.name) {
                return 1
            } else {
                return -1
            }
        }
    )
    
    let textToSave = ''

    participants.forEach(
        (part, index) => {
            const partialText = `
Usuário ${index+1}:
    NOME: ${part.name}
    EMAIL: ${part.email}`
            textToSave = textToSave + partialText
        }
    )

    console.log(textToSave)

    fs.writeFile(fileName, textToSave, (err: Error) => {
        if (err) console.log(err)
    })
}



const main = async () => {
    firebase.initializeApp(config)
    const allActivities = await getAllActivities()
    const todayActivitiesIds = filterTodayActivitiesIds(allActivities)
    console.log(todayActivitiesIds)
    const allFeedbacks = await getAllFeedbacks()
    const todayFeedbacks = allFeedbacks.filter(
        (fb) => {
             return todayActivitiesIds.indexOf(fb.activityId) !== -1
        }
    )

    const answeredTodayFeedbackUsersIds: string[] = [] 
    
    todayFeedbacks.forEach(
        (fb) => {
            for(const key in fb){
                if(key !== 'id') {
                    for (const subKey in fb[key].votesByUser){
                        if(answeredTodayFeedbackUsersIds.indexOf(subKey) === -1){
                            answeredTodayFeedbackUsersIds.push(subKey)                            
                        }  
                    }
                }
            }
        }
    )

    console.log(answeredTodayFeedbackUsersIds)

    const allParticipants = await getAllParticipants()
    const emailAndName = []
    for(const partId in allParticipants){
        if(answeredTodayFeedbackUsersIds.indexOf(partId) !== -1){
            emailAndName.push(
                {
                    name: allParticipants[partId].nome,
                    email: allParticipants[partId].email,
                }
            )
        }
    }

    console.log(emailAndName)

    writeTxtFileEmailAndName(emailAndName, 'dia1.txt')
}


main()