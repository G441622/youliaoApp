import _ from 'lodash';
import {store} from '../App';
import Storage from '../data/Storage';
import AuthService from '../services/authService';
import * as commonAction from '../actions/common/commonAction';



const DEBUG = __DEV__

export function GET(baseUrl,params,user_token_need=true,user_id_need=false){
    let userParams = userNeedCheck(user_token_need,user_id_need)

    let m = baseUrl.replace(/.*m=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let c = baseUrl.replace(/.*c=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let a = baseUrl.replace(/.*a=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())

    var token = AuthService.GetAuthToken(m,c);

    let body = {token,...params,...userParams}

    let urlParams = ''
    for (let key in body) {
        if (body.hasOwnProperty(key)) {
            let value = body[key];
            if (value==null||value==undefined||value=='') continue;
            urlParams += `&${key}=${value}`
        }
    }
    // if (a.indexOf('upload')==-1)
    if (a.indexOf('uplaod')==-1||baseUrl.indexOf('upload')==-1){
        store.dispatch(commonAction.showLoading())
    }else{
        DEBUG && console.log(a,baseUrl)
    }
    return new Promise((resolve,reject)=>{
        fetch(`${baseUrl}${urlParams}`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        .then(response=>fetchResolve(response,resolve,reject,a,baseUrl,body),error=>fetchReject(error,resolve,reject,a,baseUrl,body))
        .then(responseJson=>JsonResolve(responseJson,resolve,reject,a,baseUrl,body),error=>JsonReject(error,resolve,reject,a,baseUrl,body))
        .catch(error=>fetchCatch(error,resolve,reject,a,baseUrl,body))
    })
}

export function POST(baseUrl,params,user_token_need=true,user_id_need=false){
    let userParams = userNeedCheck(user_token_need,user_id_need)

    let m = baseUrl.replace(/.*m=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let c = baseUrl.replace(/.*c=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let a = baseUrl.replace(/.*a=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())

    let token = AuthService.GetAuthToken(m,c);
    let body = {token,...params,...userParams}
    // DEBUG && console.log(`POST : ${baseUrl}\n`,body)
    let urlParams = new FormData()
    for (let key in body) {
        if (body.hasOwnProperty(key)) {
            let value = body[key];
            urlParams.append(key,value)
        }
    }
    urlParams.append('entity','utf-8');
    // DEBUG && console.log(`${a}\nPOST : ${urlParams}`)
    if (a.indexOf('uplaod')==-1||baseUrl.indexOf('upload')==-1){
        store.dispatch(commonAction.showLoading())
    }else{
        DEBUG && console.log(a,baseUrl)
    }
    return new Promise((resolve,reject)=>{
        fetch(`${baseUrl}`,{
            headers: {
                'Accept': 'application/json;charset=utf-8',
                'Content-Type':'multipart/form-data;charset=utf-8',
            },
            headers: {},
            method: "POST",
            body:urlParams
        })
        .then(response=>fetchResolve(response,resolve,reject,a,baseUrl,body),error=>fetchReject(error,resolve,reject,a,baseUrl,body))
        .then(responseJson=>JsonResolve(responseJson,resolve,reject,a,baseUrl,body),error=>JsonReject(error,resolve,reject,a,baseUrl,body))
        .catch(error=>fetchCatch(error,resolve,reject,a,baseUrl,body))
    }) 
}
function userNeedCheck(user_token_need,user_id_need) {
    let userParams = {}
    let state = store.getState()

    let user_id = _.result(state,'root.user.userdata.user_id',undefined)
    let user_token = _.result(state,'root.user.login',undefined)

    if (user_id_need&&user_id) userParams.user_id=user_id
    if (user_token_need&&user_token) userParams.user_token=user_token

    return userParams;
}
function fetchResolve(response,resolve,reject,a,baseUrl,body) {
    // DEBUG && console.log('POST ',a,response.ok,response)
    store.dispatch(commonAction.hideLoading())
    DEBUG && console.log(response.url)
    if (!response.ok) {
        DEBUG && console.log(`fetch : ${a}`) 
        response.text().then(text=>console.log(text))
        return Promise.reject('response not ok')
    }
    return response.json()
}
function fetchReject(error,resolve,reject,a,baseUrl,body) {
    DEBUG && console.log('response error : ',a,baseUrl,error)
    store.dispatch(commonAction.hideLoading())            
    if (typeof error == 'object' && error.hasOwnProperty('message') && error.message == 'Network request failed'){
        let tip = '网络错误,请检查网络后重试'
        store.dispatch(commonAction.showTip(tip))
        return Promise.reject(tip)
    }
    return Promise.reject(error)
}
function JsonResolve(responseJson,resolve,reject,a,baseUrl,body) {
    // code != 200 
    DEBUG && console.log(`${a}\t${JSON.stringify(body)}`,responseJson)
    // if (typeof responseJson != 'object') 
    store.dispatch(commonAction.hideLoading())
    if (responseJson.code == -200) {
        return store.dispatch(commonAction.showTip('出现错误')) 
    }else if (responseJson.code==-300) {
        // TODO: 后续可以跳转到登录页面
        signoutUser()
        return store.dispatch(commonAction.showTip('尚未登录,请登录后操作')) 
    }else if (responseJson.code != 200 && responseJson.code < 0) {
        return store.dispatch(commonAction.showTip(responseJson.message?responseJson.message:'出现错误')) 
    }
    return resolve(responseJson)
}
function JsonReject(error,resolve,reject,a,baseUrl,body) {
    DEBUG && console.log('fetch response json error : ',a,baseUrl,error)
    let tip = '网络错误,请检查网络后重试'
    store.dispatch(commonAction.hideLoading())
    store.dispatch(commonAction.showTip(tip))
    return reject(error)
}
function fetchCatch(error,resolve,reject,a,baseUrl,body) {
    let tip = '网络错误,请检查网络后重试'
    store.dispatch(commonAction.showTip(tip))
    store.dispatch(commonAction.hideLoading())
    DEBUG && console.log('fetch catched : ',a,baseUrl,error)
    return reject(error)
}

export function POSTFILE(baseUrl,params,user_token_need=true,user_id_need=false){
    let userParams = userNeedCheck(user_token_need,user_id_need)

    let m = baseUrl.replace(/.*m=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let c = baseUrl.replace(/.*c=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())
    let a = baseUrl.replace(/.*a=(\w*)&*.*/,'$1').replace(/( |^)[a-z]/, (L) => L.toUpperCase())

    let token = AuthService.GetAuthToken(m,c);
    let body = {token,...params,...userParams}
    // DEBUG && console.log(`POST : ${baseUrl}\n`,body)
    let urlParams = new FormData()
    for (let key in body) {
        if (body.hasOwnProperty(key)) {
            let value = body[key];
            urlParams.append(key,value)
        }
    }
    // DEBUG && console.log(`${a}\nPOST : ${urlParams}`)
    if (a.indexOf('uplaod')==-1||baseUrl.indexOf('upload')==-1){
        store.dispatch(commonAction.showLoading())
    }else{
        DEBUG && console.log(a,baseUrl)
    }
    return new Promise((resolve,reject)=>{
        fetch(`${baseUrl}`,{
            headers: {
                // 'acceptcharset':"utf-8",
                // "Content-Disposition":"attachment",
                'Accept': 'application/json;charset=utf-8',
                'Content-Type':'multipart/form-data;charset=utf-8'
            },
            method: "POST",
            body:urlParams
        })
        .then(response=>fetchResolve(response,resolve,reject,a,baseUrl,body),error=>fetchReject(error,resolve,reject,a,baseUrl,body))
        .then(responseJson=>JsonResolve(responseJson,resolve,reject,a,baseUrl,body),error=>JsonReject(error,resolve,reject,a,baseUrl,body))
        .catch(error=>fetchCatch(error,resolve,reject,a,baseUrl,body))
    }) 
}

/** 用户需要重新登录 */
function signoutUser() {
    console.log('fetch signout')
    Storage.update('users',[],(users)=>{
        let index = _.findIndex(users,(user={})=>user.lastUser);
        if (index == -1 ) return users; 
        let user = users[index]
        users[index] = Object.assign({},user,{lastUser:false})
        return users;
    }).then(result=>{},error=>{})
    
    return dispatch({type:'SIGN_OUT'})
}


export function dispatch(params) {
    store.dispatch(params)
}


/**
 
        .then(response=>{
            // DEBUG && console.log('GET ',a,response.ok,response)
            store.dispatch(commonAction.hideLoading())
            if (!response.ok) {
                DEBUG && console.log(`GET : ${a}`) 
                response.text().then(text=>DEBUG && console.log(text))
                return reject('GET response not ok')
            }
            return response.json()
        },error=>{
            DEBUG && console.log('GET response error : ',error)
            store.dispatch(commonAction.hideLoading())            
            if (typeof error == 'object' && error.hasOwnProperty('message') && error.message == 'Network request failed'){
                let tip = '网络错误,请检查网络后重试'
                store.dispatch(commonAction.showTip(tip))
                return reject(tip)
            }
        })
        .then(responseJson=>{
            DEBUG && console.log(`${a}\t${body?JSON.stringify(body):'no body params'}`,responseJson)
            // NOTE: 有些返回值code!=200的也需要正确处理 ,-300 未登录,跳转到登录页面
            if (responseJson.code==-300) store.dispatch(commonAction.showTip('尚未登录,请登录后操作')) 
            return resolve(responseJson)
            // else return reject('result code not 200 error')
        },error=>{
            let tip = '网络错误,请检查网络后重试'
            store.dispatch(commonAction.showTip(tip))
            DEBUG && console.log('GET fetch json error : ',a,baseUrl,error)
        })
        .catch(error=>{
            let tip = '网络错误,请检查网络后重试'
            store.dispatch(commonAction.showTip(tip))
            DEBUG && console.log('GET fetch catched : ',a,baseUrl,error)
        })
 */