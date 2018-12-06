import * as firebaseAdmin from 'firebase-admin'

type PushNotification = firebaseAdmin.messaging.NotificationMessagePayload
type PushData = firebaseAdmin.messaging.DataMessagePayload
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T,K>> 

export abstract class PushManager {
    abstract sendPush(
        tokens: string[], 
        data: { [index: string]: string } ,
        title: string,
        body: string,
        otherOptions?:  { [index: string]: string }
    ): void
}

export class FCMManager extends PushManager{
    
    static app?: firebaseAdmin.app.App

    constructor() {
        FCMManager.InitializeFirebaseApp()
        super()
    }

    static InitializeFirebaseApp() {
        if(!FCMManager.app) {
            FCMManager.app = firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert({
                    projectId: 'go-in-58d15',
                    clientEmail: 'firebase-adminsdk-h7py5@go-in-58d15.iam.gserviceaccount.com',
                    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmtOTlREVedvqt\n+4xIKNNvjoR0cEF0vrtWIeB7PihLZTDtXLAHEEde2hCJ65Pg6Xz8KcnV6p/gg0t6\nmAFNkZExipUtOJSI+WcvBBircMw0BjzmlKHM9weYJxKQLABZnjBdeMacwQFdL+eN\nKL3UBnx6KS6Gv6M8+2e6qMxojUql1T3nQN2W1XXH7anlj7hb+lZaeeVaGet2IWuk\ngOYiNA4X4p2nisFAoXKnbuWHNgqPVMD5QworxWRtElu/TZd6rawPVD2r6FWqUm0Y\n/5wbBslR8xhXKJp3/qPIqLv8T1/jX+zRTUYxhuK97rfoMl/A+CUnUV8Hgmd98xAi\n+UkKYsJzAgMBAAECggEAHvJO7e4NfBFrqODgPWG0kvdEDzZroVRgXrpmmUGKOCrX\nuE9BkYD+gduwcj+2c2n+iPi2CUrSrVQPUN+I9TW8iy+yuQEo84K485aSFJUp3ySj\nEK8JUSwlyaQcGli8p0jP5gnoYmiFXVGqtsWrSQChu+VAR3T3WZvDm0c/PBsP01SZ\nJ1a3SZxidhGboGEIe+Yz+i/ZR2exQM2qCJEotQBdZ98XozkGXY4HWv1G5BIFG1Ky\njlzLRHT3MBl1ihgg4zAEX/4XxtA/gHH42Ph22NnB15K1+7lmqJuIrbnuTZjYWgi2\nzfOnOAmwGABBQkb4K5dzsQa7RD/xThVVxwurKk/fAQKBgQD2yUKFv6ZUyfSuHboU\np2PemAs5NSy+lN6rUJm0FhoFwINiEKRKAHACfaaMs9GA+f7i2vXuW5Z3x+TCCLU1\nMBdJ8bvUeQ+c+txdj+o2XMuz4DoFa/nH+LDI2dFe8KiUiN67a07detzXjd+cgDzU\n2BnLNJNh3qLRNYShnmlLwHLo8wKBgQDvUfLZ8TpAObJ2Sq8HiHqhzGWLSekbvhXa\nF8Nl74g+F1mn6MSyo9yct6PkL/DdaW1XqpgxTAbdWt9VpGAYHJvP/Nmebxi4MwPA\n4dWZbFNokv3mJcM1zHBxN6AP+g7uco5ylItgmQ0bxDcGIerQK+LizTF5GQ4EtTUn\nxceiBm8ggQKBgQDQ0z0XMDTvSnVhYIY1M++uS7ozjmtuWUqSbIGjgZBDjcOfF7Xt\naLFfajOknASLvv+Ptvij2ZxZfyxzhCrR9v+98m+eO1Ka4yvVgBIQLjWw3+w46kVS\nkX4Gd0pTrBD6n1baANObVnvJaqPtKhZPhQ1Ohg6wolPj9AVnPUScdRzHQQKBgCUb\nvd5Ra0jeKW/yMKWoYeuIuA4bDcxBcz34BVJfC+8ky8AfdbCFfAXI697MGDscx9ma\nGDM8qKvWFV9AN65FcVuUx2GrtFeLgX99BRPfGifS8w+mt1g2NRE5INaZXYtXtALM\nSbhWwxOVHzsSM0jIJUwpqQwv+F5+gpmCL2xONxkBAoGBAIAo5K+SsegAmYQqd/tg\n06ymZdMdzbo6oOgGbojlBGiBusOxgqvdoUEvNLqmzKX1xPdueBFQK6FkAkamZRgg\n5KA44CacUjXj0utoJ+0JgddWmUpmqq0R/ItO1ypWPVmDlh8Zr3YzJktK+mrwpLKt\ne3Xu/lr3Gkw+RlPbf8ae02sE\n-----END PRIVATE KEY-----\n",
                })
            })
        }
    }

    public async sendPush(
        tokens: string[], 
        data: PushData,
        title: string,
        body: string,
        otherOptions?: Omit<PushNotification, 'title' | 'body'>) {

        let notification: PushNotification = {
            title,
            body,
            ...otherOptions
        }

        console.log('... Sending Push ...')

        return new Promise((resolve, reject) => {
            firebaseAdmin.messaging().sendToDevice(
                tokens,
                {
                    data,
                    notification
                }).then((value) => {
                    console.log('value: ', value)
                    console.log('results: ', value.results)
                    resolve(value)
                }, (err) => {
                    console.log('err: ', err)
                    reject(err)
                })
        })
    }

}

let main = async () => {
    const fcmManager = new FCMManager()
    await fcmManager.sendPush(
        [
            "cuCubASG2HM:APA91bGx9_0rb1UW9RZL1ZEDt4kHlgHZgMnM7S0ReWordRUVja428MTmNy-2Nhem3DdTnFuQmOyeW3JSFVAwcHKbAxQ2H4eqUykDPC3ZcBKnRp_mzrahjc3gih8m4OJvX0llcVg2QI-k"
            
        ],
        { 
            id: 'myID', 
            hasSomething: 'jkj', 
            age: 'jkl'
        },
        'PUSH TESTS 4',
        'MY PUSH DESCRIPITION 4'
    )
}

main()