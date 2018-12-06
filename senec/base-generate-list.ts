import * as firebase from "firebase"
import * as fs from 'fs'

export class BaseGenerateList {
    // senec-dev
    // protected config = {
    //     apiKey: "AIzaSyB3UI0l-u2cP5PCzOBtnWB8f8u7361W7Vw",
    //     authDomain: "senec-dev.firebaseapp.com",
    //     databaseURL: "https://senec-dev.firebaseio.com",
    //     storageBucket: "senec-dev.appspot.com",  
    // }


    // senec-app
    protected config = {
        apiKey: "AIzaSyCXPcDPKSlZRJXI-K8dSjuoAof-HjyIAM0",
        authDomain: "senec-app.firebaseapp.com",
        databaseURL: "https://senec-app.firebaseio.com",
        storageBucket: "senec-app.appspot.com",  
    }

    protected activities: any [] = []
    protected participants: any[] = []

    protected async init() {
        firebase.initializeApp(this.config)

        console.log('\nBaixando os participantes...')
        const participantsOutput = await new Promise<any>((resolve, reject) => {
            firebase.database()
                .ref('participantes')
                .on('value', (snapshot) => {
                    if(!snapshot) {
                        throw new Error("No users found ")
                    }
                    resolve(snapshot.val())
                })
        })
        for(const key in participantsOutput){
            this.participants.push(
                {
                    id: key,
                    ...participantsOutput[key]
                }
            )
        }

        
        console.log('Participantes baixados!')
        
        console.log('\nBaxando as atividades...')
        const activitiesOutput = await new Promise<any>((resolve, reject) => {
            firebase.database()
                .ref('atividades')
                .on('value', (snapshot) => {
                    if(!snapshot) {
                        throw new Error("No activities found ")
                    }
                    resolve(snapshot.val())
                })
        })
        for(const actKey in activitiesOutput){
            this.activities.push({
                id: actKey,
                date: Date.parse(activitiesOutput[actKey].inicioAtividade),
                ...activitiesOutput[actKey]
            })
        }
        console.log('activities baixadas!')
    }

    protected async writeTxt(infos: string, fileName: string){
        return new Promise<void> ((resolve, reject) => {
            fs.writeFile(fileName, infos, (err: Error) => {
                if (err) console.log(err)
            })
        })
    }
}