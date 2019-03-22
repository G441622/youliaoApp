import * as types from './userConstant';
import userShareApi from '../../api/user/userShareApi';


export function getShareCode(){
    return function(dispatch, getState){
        return userShareApi.getShareCode()
            .then(result => {
                dispatch({type:types.GET_CODE_SHARE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}

export function getExchangeCode(code){
    return function(dispatch, getState){
        return userShareApi.getExchangeCode(code)
            .then(result => {
                dispatch({type:types.EXCHANGE_CODE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}

export function getShareList(input){
    return function(dispatch, getState){
        return userShareApi.getShareList(input)
            .then(result => {
                dispatch({type:types.SHARE_LIST, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}