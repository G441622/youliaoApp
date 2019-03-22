import * as types from './userConstant';
import loginApi from '../../api/user/loginApi';
import Storage from '../../data/Storage';
import * as commonAction  from '../common/commonAction';
import * as userAction from './userAction';

export function getToken(account,pwd){
    return function(dispatch, getState){
        return loginApi.getToken(account,pwd)
            .then(result => {
                if (result.code == 203)  return dispatch(commonAction.showTip('用户不存在'))
                if (result.code == 204)  return dispatch(commonAction.showTip('密码错误'))
                dispatch({type:types.GET_TOKEN_LOGIN, data:result.info.token});
                dispatch(userAction.getUser())
            })
            .catch(error =>{

            });
    };
}

/**
 * 
 * @param {userinfo(json)  json中的platform(微信=>wx QQ=>qq 微博=>wb)} params 
 */
export function thirdLogin(params){
    return function(dispatch,getState){
        return loginApi.thirdLogin(params)
        .then(result=>{
            if (result.code !== 200) return Promise.reject('login error')
            dispatch({type:types.GET_TOKEN_LOGIN,data:result.info})
            dispatch(userAction.getUser())
        })
    }
}