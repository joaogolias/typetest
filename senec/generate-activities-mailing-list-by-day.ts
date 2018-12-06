import { BaseGenerateList } from "./base-generate-list";
import * as firebase from 'firebase';

class GenerateActivitiesMailingListByDay extends BaseGenerateList {
    private  subscriptions: any[] = []

    public async execute() {
        await this.init()
        await this.getAllSubscriptions()

        const todayActivities = this.filterTodayActivities(this.activities)

        todayActivities.forEach(
            async (activity) => {
                const participantsIds = this.filterParticipantsByActivity(activity.id)
                const participantsInfos = this.getParticipantsInfos(participantsIds)
                
                return new Promise<void> (async (resolve, reject) => {
                    await this.writeEmailListTxt(
                        participantsInfos.map((p) => p.email), 
                        `${activity.titulo.replace(/\s/g,'')}-mailing-list.txt`)
                })  
            })
    }

    public async getAllSubscriptions(){
        console.log("\nBaixando as inscrições...")
        const subscriptionsOutput = await new Promise<any>((resolve, reject) => {
            firebase.database()
                .ref('inscricoes')
                .on('value', (snapshot) => {
                    if(!snapshot) {
                        throw new Error("No inscricoes found ")
                    }
                    resolve(snapshot.val())
                })
        })
        for(const key in subscriptionsOutput){
            this.subscriptions.push(
                {
                    id: key,
                    ...subscriptionsOutput[key]
                }
            )
        }
        console.log("Inscrições baixadas!")
    }
    
    public filterTodayActivities(activities: any[]){
        const filteredActitivies = activities
            .filter(
                (act) => {
                    const today = (new Date()).setHours(0,0,0,0)
                    const actDate = (new Date(act.date)).setHours(0,0,0,0)
                    return today === actDate
                }
            )
        return filteredActitivies
    }

    public filterParticipantsByActivity(activityId: string){
        const participantsIds: string[] = []
        for(const sub of this.subscriptions) {
            if(sub.atividadeId === activityId){
                participantsIds.push(sub.participanteId)
            }
        }
        return participantsIds
    }

    public getParticipantsInfos(participantsIds: string[]){
        const participantsInfos:any[] = []
        this.participants.forEach(
            (part) => {
                if(participantsIds.indexOf(part.id) !== -1){
                    participantsInfos.push(
                        {
                            name: part.nome,
                            email: part.email,
                            cpf: part.cpf
                        }
                    )}})
        return participantsInfos
    }

    public async writeEmailListTxt(emails: string[], fileName: string){
        console.log(`\nEscrevendo arquivo ${fileName}...`)

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
        
        // return new Promise<void> (async (resolve, reject) => {
            await this.writeTxt(emailsToWrite, `documentos/${fileName}`)
            console.log('Arquivo finalizado!')
        // })
    }
}


const main = async () => {
    const generateList = new GenerateActivitiesMailingListByDay()
    await generateList.execute()
}

main()
// const getActivities 