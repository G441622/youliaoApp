import * as types from './userConstant';
import settingApi from '../../api/user/settingApi';
import * as Storage from '../../data/Storage';
import _ from 'lodash';

export function postSetting(input){
    return function(dispatch, getState){
        return settingApi.postSetting(input)
            .then(result => {
                if (result.code !== 200) return;
                dispatch({type:types.POST_SETTING, data:input});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getSetting(token){
    return function(dispatch, getState){
        return settingApi.getSetting(token)
            .then(result => {
                if (result.code !== 200) return;
                dispatch({type:types.GET_SETTING, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function signout(){
    return function(dispatch,getState){
        // Storage.remove('user').then(result=>{},error=>{})
        Storage.update('users',[],(users)=>{
            let index = _.findIndex(users,(user={})=>user.lastUser);
            if (index == -1 ) return users; 
            let user = users[index]
            users[index] = Object.assign({},user,{lastUser:false})
            return users;
        }).then(result=>{},error=>{})
        return dispatch({type:types.SIGN_OUT})
    }
}