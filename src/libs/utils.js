
export async function wait(time){
    return new Promise((resolve)=>{
        setTimeout(resolve,time)
    })
}

const sizeUnit=['B','K','M','G','T','E']
export function formatSize(size=0){
    let i=0
    while(size>=1000){
        size=size/1024
        i++
    }
    return size.toFixed(2)+sizeUnit[i]
}