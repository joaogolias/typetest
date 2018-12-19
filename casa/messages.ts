export class SnsMessageManager{
    public messages: MessageDictionary = {
        LikePost: {
            'pt': 'O usuário $name$ curtiu seu post ',
            'en': 'The user $name$ liked your post',
        },
        ExchangePropose: {
            'pt': '$name$ fez uma proposta no item $itemName$',
            'en': '$name$ made a propose to item $itemName$',
        },
        CommentPost: {
            pt: 'Alguém comentou seu post',
            en: 'Somebody has commented in your post',
        }
    }

    generateMessage(pushType: PushTypes, language: LanguageEnum, ...args: string[]) {
        let message = this.messages[pushType][language]
       
        if (!message) {
            message = this.messages[pushType][LanguageEnum.en]
        }
        
        args.forEach(
            (arg) => {
                message = message!.replace(/(\$.*?\$)/, arg)
                console.log(message)
            }
        )

        return message
    }
}



export enum PushTypes{
    LikePost = "LikePost",
    ExchagePropose = "ExchangePropose",
    CommentPost = "CommentPost"
}

type MessageDictionary = {
    [P in PushTypes]: TranslatedMessages
}

type TranslatedMessages = {
    [P in LanguageEnum]?: string
}

export enum LanguageEnum {
    en = 'en',
    fr = 'fr',
    es = 'es',
    pt = 'pt',
    it = 'it',
    de = 'de',
    zh = 'zh',
    nl = 'nl',
    ja = 'ja',
    ko = 'ko',
    vi = 'vi',
    ru = 'ru',
    sv = 'sv',
    da = 'da',
    fi = 'fi',
    nb = 'nb',
    tr = 'tr',
    el = 'el',
    id = 'id',
    ms = 'ms',
    th = 'th',
    hi = 'hi',
    hu = 'hu',
    pl = 'pl',
    cs = 'cs',
    sk = 'sk',
    uk = 'uk',
    hr = 'hr',
    ca = 'ca',
    ro = 'ro',
    he = 'he',
    ar = 'ar' 
  }
  

const manager = new SnsMessageManager()
const m = manager.generateMessage(PushTypes.ExchagePropose, LanguageEnum.en, 'Golias', 'book')

console.log(m)