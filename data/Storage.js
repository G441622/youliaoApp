import { AsyncStorage } from 'react-native';

function save(key,value){
    if (typeof value === 'object') value = JSON.stringify(value)
    return AsyncStorage.setItem(key, value);
}

function get(key){
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem(key).then(result=>{
            if (result){
                resolve(JSON.parse(result))
            }else{
                reject(new Error(`get ${key} is error : value is null`))
            }
        },error=>{
            reject(error)
        });
    });
}

function remove(key){
    return AsyncStorage.removeItem(key)
}

function update(key,value,comparator=null){
    // if (typeof value === 'object') value = JSON.stringify(value)
    return new Promise((resolve,reject)=>{
        get(key).then((item) => {
            if (comparator && typeof comparator == 'function') {
                value = comparator(item,value)
            }else{
                value = typeof value == 'string'
                ? value
                : (Array.isArray(item)
                    ? [...item,...value]
                    : Object.assign({}, item, value));
            }
            AsyncStorage.setItem(key, JSON.stringify(value)).then(resolve,reject);
        },error=>{
            AsyncStorage.setItem(key, JSON.stringify(value)).then(resolve,reject);
        });
    })
}

module.exports = {
    save,
    get,
    remove,
    update
}