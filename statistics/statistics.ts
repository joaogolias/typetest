export class StatisticManager {
    public avarage?: number
    public stdDev?: number
    public confidenceIntervalAmplitude?: number

    constructor(
        private title: string,
        private data: number[]){}
    
    public setData(newData: number[]){
        this.data = newData
    }
    
    public getData() {
        return this.data
    }

    private calculateAvarage(){
        if(!this.avarage) {
            let avarage = this.data.reduce(
                (acc, curr) => (acc += curr)
            )
            avarage = avarage/(this.data.length)

            this.avarage = avarage
        }
       
        return this.avarage
    }

    private calculateStandardDeviation() {
        if(!this.stdDev) {
            const avarage = this.calculateAvarage()

            let stdDev = this.data.reduce(
                (acc, curr, i) => {
                    if(i == 1) {
                        acc = (acc-avarage)*(acc-avarage)
                    }
                    return (acc += (curr-avarage)*(curr-avarage))
                }
            )
    
            stdDev = Math.sqrt(stdDev/(this.data.length - 1))
            this.stdDev = stdDev
        }
        
        return this.stdDev
    }
    
    private calculateconfidenceIntervalAmplitude() {
        if(!this.confidenceIntervalAmplitude) {
            const stdDev = this.calculateStandardDeviation()

            const tStudentValue =  1.984 //for n=100 (df = 99) and confidenceLevel=95%
            const quatitySqrt = Math.sqrt(this.data.length)
            const confidenceIntervalAmplitude = tStudentValue*stdDev/(quatitySqrt)
            this.confidenceIntervalAmplitude= confidenceIntervalAmplitude
        }
        return this.confidenceIntervalAmplitude
    }

    public generateResults() {
        this.calculateconfidenceIntervalAmplitude()
        console.log('\x1b[32m%s\x1b[0m', this.title.toUpperCase())
        console.log('\x1b[33m%s\x1b[0m', "DESCRIPTIVE STATISTICS")
        console.log('Avarage: ', this.avarage)
        console.log('StdDev: ', this.stdDev)
        const minConfidenceInterval = this.avarage! - this.confidenceIntervalAmplitude!
        const maxConfidenceInterval = this.avarage! + this.confidenceIntervalAmplitude!
        console.log('\x1b[33m%s\x1b[0m','CONFINDENCE INTERVAL INFOS')
        console.log('Confidence Interval: [', minConfidenceInterval, ', ', maxConfidenceInterval, ']' )
        console.log('Confidence Interval Amplitude: ', this.confidenceIntervalAmplitude!)
    }
}



const data = [1,2,3,4,5, 6, 7, 8, 9, 10,11,109,108,-4,-5,19,-108,-200,-10,-5]
const statistics = new StatisticManager('Teste',data)
statistics.generateResults()