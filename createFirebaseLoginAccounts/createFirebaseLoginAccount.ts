import * as parser from 'csv-parse'
import * as nodemailer from 'nodemailer'
import * as firebase from 'firebase'
import * as admin from 'firebase-admin'
import * as readline from 'readline'
import fs = require('fs')

const rightDirName = __dirname.replace("build/", "")
interface User { email: string; name: string; nickname: string, role: {admin: boolean}, password?: string, id?: string}

export class CreateFirebaseLoginAccounts {

    public userDb: admin.database.Reference

    constructor() {
        const config = {
            apiKey: "AIzaSyBaVviwOhFXYf709BtcMcJ8P1H1xahoI3Q",
            authDomain: "treasure-hunt-b855d.firebaseapp.com",
            databaseURL: "https://treasure-hunt-b855d.firebaseio.com",
            projectId: "treasure-hunt-b855d",
            storageBucket: "treasure-hunt-b855d.appspot.com",
            messagingSenderId: "280333949539"
          }
          const adminConfig = {
            credential: admin.credential.cert({
                projectId: 'treasure-hunt-b855d"',
                privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJzaQaISyPIeyv\n15q/tTAiJHt9NVIs1co7Wd8FvzH1cwjeBPGlUU79WLKR72oTr1LmUNYuLZELhJcX\npylZoYLXlUsjO3Jo+jaWBB46kyadIJ2Wzob4H9s3LXAnd2vRuJ+WqRr5KaqBM05J\nWgjX8/hEN+iz8MzCPU+vJZyTr5y14IxRacSrf3EB++XQV+mxMJBDg/S46fmtMya4\nGaj42LLKvy0/2+uN12KAJ7LnLPpHt8WiUj15v4bwjNU39GKUY1OW+Hx36Ls0NNov\noyGjXe61FHI2qEvepzUK3z0YyL1ObGmQHuUs0oxflsIedrIcJOaNttJbRUDaotgl\nVpS1XlsBAgMBAAECggEAATIxXbsdIdDEHeb3sbyaFXkN2rSjkt2JzCEBotFR4Zuj\nT1SPwSURthoN2sfEsWtCHW3C63AsnfH03CFgS+8hq2HaYMBCvWdnd/KDVC/MDvjv\nciz4qWbY0qxND+m1ogKl4kZIq9npsDnD1E+3uqxFaClS1hr3cUVVgdXQW7EdnOXz\nfY2EZYRahZqm/jfMxKROq3Y8aBPlTWxD/H/mu0hx+BesSEidCFu1Dd8pFZInzYl3\ncdsYFL2BMU4158Pb0fAIPtFJsyN7BrRwXkZtaB9pSYcjG3Ps3p+wzfqqE9JwlHE5\nQJsZ4F4JkXSngdg6pOWJdiFcZ6Dk+mMxjo1/PbfyiQKBgQDnP1/cEM6cqJPB2VQP\npNfnhf0zKTpk7dVuzgrFVYVbzLa2QG79fQ9IRDQnMeMbCjuJxVyZ39Eiq9FDCW7S\nRpw0gUc6Bpb13NS6XwN3vgZkMVQSLlxcRkSsoufb/mcYWMq5VU8aTa7F7zCeXL2D\nhUv9MFzeCGClqZnpOi44WvQ1CQKBgQDfZ2/sOZIJ1/NzKlReAk0DAD7QEtdqEIqj\n51AaX9Q9dM8ERGAZPmHzWjWJMap4o2X3Rdy3/F4zsjp1Cx2IBEelaa7CI4EiEIWU\nHg1AEKYXy6X1zyNdbyKtrX2LKfMYrNyJfCDEo/jzfRz7Ecfx781Vj3KEl5q66lQv\ne090XhksOQKBgQDRlvAEHjuVY3kgPiDhWO/SyO9XWmuxpJpIpni+qCeJr35+quGt\n4JZkUmTOjXmgPWL/GKE4WdJMUVwGHVuTPCpBsFZlMinKxw8LqCgVdGaIkuj23Ywa\nmhmOOsxY6Th5qah71+UtGvFoNsVjEv01YjAgV6AkIYWvQIveBjx0GYOzOQKBgEJ8\nViLHP18OlbVAc7tGlATAnfDuqo02PwxoWr5+pntjt/hdIPxiRGRYBHbAASvF9SKR\n+A4JXT+lWyBaHn/MRkZEHW5JgrTQlfBuwSK/0a5jPRDahHvaB0gIycQQx/gf+cIw\n3s+mvQA5y9YshITMCR/dgQdU1weplURMPmkzV+qBAoGAQOWVJYH2wnLWyM8i4yvJ\nm3a8d7ZmPmtLGMN6g2Qsk1eG5nbqmPuQ6zP0E8JKCxCnKSadvT4Uq30rxxa2jtEJ\nvhqMZvimP8EyO7+pu4KkxAEI3YGf7Yx+GKZQ0yxO9hirvoxY8RuOiD66zrispmQf\nG+CW2ngz/QWbDLcnvT43q7c=\n-----END PRIVATE KEY-----\n",
                clientEmail: "firebase-adminsdk-dsy3d@treasure-hunt-b855d.iam.gserviceaccount.com",
              }),
              databaseURL: 'https://treasure-hunt-b855d.firebaseio.com'
          }
        firebase.initializeApp(config)
        admin.initializeApp(adminConfig)
        this.userDb = admin.database().ref("users")
    }

    public async createFromCSV(path: string) {
        const parseCSV = new ParseCSV()
        const users = await parseCSV.parseCSVToUserArray(path)
        console.log("users: ", users)
        for(const user of users) {
            try {
                this.createLoginAndUser(user)
                
            } catch (err) {
                console.log("err: ", err)
            }
           
        }
        console.log(users)
    }

    private async createLoginAndUser(user: User) {
        let newUser = await this.createLogin(user)
        console.log("newUser: ", newUser)
        await this.sendEmail(newUser.email, 
            this.createMessage(newUser.password || "123", newUser.email, newUser.name, newUser.role === {admin: true}))
        await this.createUser(newUser)
    } 

    private async createLogin(user: User): Promise<any> {
        const randomPass = Math.random().toString(36).substring(2)
        return new Promise<User>(async (res, rej) => {
            await firebase.auth().createUserWithEmailAndPassword(user.email, randomPass)
                .then((result) => {
                    console.log("created in firebase: ", result)
                    
                    res({
                        ...user,
                        password: randomPass,
                        id: result.user ? result.user.uid : "id"
                    })
                })
        })

    }
    
    private async createUser(user: User): Promise<void>{
        if(user) delete user.password
        return new Promise<void> ((res, rej) => {
            console.log("HEEEERE")
            console.log("user: ", user) 
            this.userDb.child(user.id || "123").set(user).then((result) => {
                console.log('result: ', result)
                res()
            })
        })
    }

    private async sendEmail(to: string, message: string): Promise<void>{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            requireTLS: true,
            auth: {
              user: 'joaovgolias@gmail.com',
              pass: '1015115 8992902'
            }
          });
          
          const mailOptions = {
            from: 'joaovgolias@gmail.com',
            to,
            subject: '[Clube dos Amiguinhos] Confidencial',
            text: message
          };
          console.log ("sending email to: ", to)
          return new Promise<void> ((res, rej) => {
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  res()
                }})
          })
          
    }
    

    private createMessage(password: string, email: string, name: string, isAdmin: boolean) {
        return `Olá ${name}, você foi adicionado a um site que o CEE usará durante o caça${isAdmin ? ", como admin." : ""} 
        Mais informações serão passadas somente no primeiro dia, mas, por hora, está aqui o seu login:
        Login: ${email}
        Senha: ${password}
        Qualquer dúvida entre em contato com o Golias, Darvas, Gestão ou Corrupto.
        
        BCMP!`
    }
}

export class ParseCSV {
    public async parseCSVToUserArray(path: string): Promise<User[]> {
        
        return new Promise<User[]>(async (res, rej) => {
            try {
                const usersArray: User[] = []
                await fs.createReadStream(rightDirName + `/${path}`, { encoding: 'utf8' })
                    .pipe(parser({delimiter: '\n'}))
                    .on('data', (data) => {
                        const splitData = data[0].split(";")
                        console.log(splitData)
                        const newUser: User = {
                            email: splitData[0],
                            nickname: splitData[1],
                            name: splitData[2],
                            role: {admin: splitData[3] === "admin"} 
                        }

                        newUser.nickname = newUser.nickname.toLowerCase()
                            .replace(" ", "_")

                        const userWithSameNick = usersArray.filter((user) => user.nickname.indexOf(newUser.nickname) !== -1)
                        if(userWithSameNick.length) newUser.nickname = newUser.nickname + (userWithSameNick.length + 1).toString()
                        
                        if(newUser.email.indexOf("@") !== -1) usersArray.push(newUser)
                    })
                    .on('end', () => {
                        res(usersArray)
                    })
            } catch (err) {
                rej(err)
            }
                
        })
    }
}

(new CreateFirebaseLoginAccounts()).createFromCSV('integracee_2019.csv')