import { FileManager } from "../../utils/file-manager";



const main = async() => {
    const array = FileManager.readJson('./images.json')
    const newArray: any[] = []
    console.log('Initial array length: ', array.length)
    for(const item of array) {
        if(!newArray.find((el) => el.link === item.link)) {
            newArray.push(item)
        }
    }
    console.log('Final array length: ', newArray.length)
    if(newArray.length !== array.length) {
        FileManager.writeFile(newArray, './images.json')
    }
}

main()