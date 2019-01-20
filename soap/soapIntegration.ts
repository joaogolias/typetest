import * as soap from 'soap'

class SoapIntegration {
    constructor(private url: string){}

    public async runMethod(methodPath: string, input: any, pointer: string = '.') {
        const client = await soap.createClientAsync(this.url)
        const paths = methodPath.split(pointer)
        let clientReference: any = client
        paths.forEach((path: string) => {
            clientReference = clientReference[path]
            console.log("clientReference: ", clientReference)
        })

        return new Promise<any>(((resolve, reject) => {
            clientReference(input, (err: any, result: any) => {
                if(err) reject(err)
                if(result) resolve(result)
                })
            })
        )
    }

    public async runThis() {
        const a = await this.runMethod("BLZService.BLZServiceSOAP11port_http.getBank", {blz: "51220800"})
        console.log("Result after promise: ", a)
        // EXEMPLO DE SAÍDA'

        // Result after promise:  { details:
        // { bezeichnung: 'Banco do Brasil',
        //     bic: 'BRASDEFFXXX',
        //     ort: 'Frankfurt am Main',
        //     plz: '60003' } }

    }
}

const blzService = new SoapIntegration("http://www.thomas-bayer.com/axis2/services/BLZService?wsdl")
blzService.runThis()
