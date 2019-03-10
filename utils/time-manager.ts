
export class TimeManager {
    public static sleep(miliseconds: number) {
        const start = new Date().getTime();
        for(let i = 0; i < 1e12; i++) {
            if((new Date().getTime() - start) > miliseconds) {
                break;
            }
        }
    }

    public static pretiffyTime(miliseconds: number): string {
        let seconds = miliseconds/1000
        let minutes = seconds/60
        let hours = minutes/60
        let days = minutes/24

        if(days > 1) {
            return `${days.toFixed(2)} dias`
        } else if (hours > 1) {
            return `${hours.toFixed(2)}h`
        } else if (minutes > 1) {
            return `${minutes.toFixed(2)}min` 
        } else if (seconds > 1) {
            return `${seconds.toFixed(2)}s`
        } else {
            return `${miliseconds.toFixed(2)}ms`
        }
    }
}