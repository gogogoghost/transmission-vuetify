const sessionHeader = 'X-Transmission-Session-Id'
const baseUrl = '../rpc'

let sessionId = null

export async function request(method,args,retry=true){
    const headers = new Headers();
    headers.append('cache-control', 'no-cache');
    headers.append('content-type', 'application/json');
    headers.append('pragma', 'no-cache');
    if (sessionId) {
      headers.append(sessionHeader, sessionId);
    }
    const o={
        method:method,
        arguments:args
    }
    try{
        const res = await fetch(baseUrl, {
            body: JSON.stringify(o),
            headers,
            method: 'POST',
        })
        if(res.status===409){
            if(retry){
                // copy the session header and try again
                sessionId = res.headers.get(sessionHeader)
                return await request(method,args,false)
            }else{
                throw "409:Cannot Get Session"
            }
        }else if(res.status==200){
            const obj=await res.json()
            if(obj.result!=='success'){
                throw obj.result??'Unknown error'
            }
            return obj.arguments
        }else{
            throw res.status+":"+res.statusText
        }
    }catch(e){
        throw e
    }
}