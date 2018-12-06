import * as fs from 'fs'


// comando para puxar todos os usuários: firebase auth:export participantes-senec.json --project senec-app --format=json

const main = () => {
    const participantesInfo = require('./participantes-senec.json')
    const parsedParticipants = parseJsonToModel(participantesInfo)
    const emails = getEmails(parsedParticipants)
    writeTxtFile(emails)
}

const parseJsonToModel = (participantesJson: any): Participant[] =>  {
    const participantsArray = participantesJson.users.map( (data: any) => (
        new Participant(
            data.localId,
            data.email,
            data.emailVerified,
            data.passwordHash,
            data.salt,
            data.lastSignedInAt,
            data.createdAt,
            data.providerUserInfo)))
    
    return participantsArray
}

const getEmails = (participants: Participant[]): string[] => {
    const emails = participants.map(participant => participant.email)
    return emails
}

const writeTxtFile = (emails: string[]): void => {
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

    fs.writeFile('emails.txt', emailsToWrite, (err) => {
        if (err) console.log(err)
    })
}


class Participant {
    constructor(
        public localId: string,
        public email: string,
        public emailVerified: boolean,
        public passwordHash: string,
        public salt: string,
        public lastSignedInAt: string,
        public createdAt: string,
        public providerUserInfo: any
    ) {}
}


main()