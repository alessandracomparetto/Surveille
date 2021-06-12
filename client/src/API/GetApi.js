const getSurveys = ()=>{
    return new Promise((resolve, reject)=>{
        fetch("http://localhost:3000/api/surveys",{
            method : "GET"
        })
            .then((res) => {
                if(!res.ok){
                    const error = new Error(`${res.status}: ${res.statusText}`);
                    error.response = res;
                    throw error;
                }
                resolve(res.json());
            })
            .catch((err)=>{
                if(err.response){
                    err.response.json()
                    .then((info)=>{
                        reject({ message: err.message, details: JSON.stringify(info)})
                    })
                }else{
                    reject({message: err.message})
                }
            })
    })
}

export {
    getSurveys
}