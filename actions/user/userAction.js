import * as types from './userConstant';
import userApi from '../../api/user/userApi';
import * as Storage from '../../data/Storage';
import * as settingAction from './settingAction';
import * as commonAction from '../common/commonAction';
import _ from 'lodash';

// /** 用户信息 */
export function getUser(usertoken=null){
    // console.log('getUser : ',usertoken)
    return function(dispatch, getState){
        let state = getState();
        usertoken = _.result(state.root.user,'login',usertoken)
        if (!usertoken) return;
        return userApi.getUser(usertoken)
            .then(result => {
                if (result.code != 200 || !result.info) return noUser(dispatch);
                dispatch({type:types.GET_USER, data:result.info});
                settingAction.getSetting()
            })
            .catch(error =>{

            });
    };
}
export function isLogin(){
    return function(dispatch, getState){
        // Storage.get('user').then(user=>{
        //     if (!user) return;
        //     try {
        //         dispatch({type:types.IS_LOGIN,data:user})
        //         let user_token = user.login
        //         getUser(user_token)
        //     } catch (error) {
        //         console.log('isLogin catch : ',error)
        //     }
        // },error=>{
        //     console.log('==== is not login ====')
        // })
        Storage.get('users').then(users=>{
            console.log(users)
            if (!users) return;
            try {
                let index = _.findIndex(users,(user={})=>user.lastUser)
                console.log(index)
                if (index==-1) return ; 
                let user = users[index];
                let user_token = user.login
                getUser(user_token)
                dispatch({type:types.IS_LOGIN,data:user})
            } catch (error) {
                // console.log('isLogin catch : ',error)
            }
        },error=>{
            // console.log('==== is not login ====')
        })
    }
}

/** 搜索相关 */
export function addNewsSearchHistory(searchItem) {
    return function (dispatch, getState) {
        dispatch({type:types.ADD_NEWS_SEARCH_HISTORY,data:searchItem})
    }
}

export function deleteNewsSearchHistory(deleteItem=null) {
    return function(dispatch, getState) {
        dispatch({type:types.DELETE_NEWS_SEARCH_HISTORY,data:deleteItem})
    }
}

export function addForumSearchHistory(searchItem) {
    return function (dispatch, getState) {
        dispatch({type:types.ADD_FORUM_SEARCH_HISTORY,data:searchItem})
    }
}
export function deleteForumSearchHistory(deleteItem=null) {
    return function(dispatch, getState) {
        dispatch({type:types.DELETE_FORUM_SEARCH_HISTORY,data:deleteItem})
    }
}

export function hotSearchKeyword() {
    return function(dispatch, getState) {
        return userApi.hotSearchKeyword()
        .then(result=>{
            if (result.code == 200) dispatch({type:types.HOT_SEARCH_KEYWORD,data:result.info}) 
        })
    }
}

export function placeholderSearchKeyword() {
    return function(dispatch, getState) {
        userApi.placeholderSearchKeyword()
        .then(responseJosn=>{
            if (responseJosn.code==200){
                dispatch({type:types.PLACEHOLDER_SEARCH_KEYWORD,data:responseJosn.info})
            }
        })
    }
}

// /** 用户信息修改 */
export function changeAvatar(file) {
    return function(dispatch, getState) {
        return userApi.changeAvatar(file)
        .then(result=>{
            if(result.code == 200) dispatch({type:types.CHANGE_AVATAR,data:result.info})
        },error=>dispatch(commonAction.showTip('请检查网络后重试')))
    }
}
export function changeBackground(file) {
    return function(dispatch, getState) {
        return userApi.changeBackground(file)
        .then(result=>{
            if(result.code == 200) dispatch({type:types.CHANGE_BACKGROUND,data:result.info})
        },error=>dispatch(commonAction.showTip('请检查网络后重试')))
    }
}

export function forgetPassword(phone,newPassword){
    return function(dispatch, getState){
        return userApi.forgetPassword(phone,newPassword)
        .then(result=>{
            if (result.code != 200) return;
            dispatch({type:types.FORGET_PASSWORD,data:result.info})
        },error=>console.log(error))
        
    }
}
export function changePassword(phone,newPassword){
    return function(dispatch, getState){
        return userApi.forgetPassword(phone,newPassword)
        .then(result=>{
            if (result.code != 200) return;
            dispatch({type:types.CHANGE_PASSWORD,data:result.info})
        },error=>console.log(error))
    }
}
/**
 * 
 * @param {Object : {userinfo : @String {uid,name,iconurl,gender,platform}} } params 
 */
export function bindThirdPartyAccount(params) {
    return function (dispatch, getState) {
        return userApi.bindThirdPartyAccount(params)
        .then(result=>{
            let platform = JSON.parse(params.userinfo).platform;
            let name = JSON.parse(params.userinfo).name;
            dispatch({type:types.BIND_THIRD_PARTY_ACCOUNT,data:platform,name})
        },error=>console.log(error))
    }
}
export function freeBindThirdPartyAccount(params) {
    return function (dispatch, getState) {
        return userApi.freeBindThirdPartyAccount(params)
        .then(result=>{
            let platform = params.action;
            dispatch({type:types.FREE_BIND_THIRD_PARTY_ACCOUNT,data:platform})
        },error=>console.log(error))
    }
}
export function bindPhone(phone) {
    return function (dispatch, getState) {
        return userApi.bindPhone(phone)
        .then(result=>{
            if (result.code == -202) return dispatch(commonAction.showTip('该账号已绑定'))
            if (result.code !== 200) return dispatch(commonAction.showTip('出现错误,请重新发送验证码后尝试'));;
            dispatch({type:types.BIND_PHONE,data:result.info})
        },error=>console.log(error))
    }
}
export function setFontSize(fontSize){
    return function(dispatch, getState){
        return dispatch({type:types.FONT_SIZE, data:fontSize})
    }
}

export function addDrafts(params) {
    return function(dispatch, getState) {
        return dispatch({type:types.ADD_DRAFTS,data:params})
    }
}
export function changeDrafts(params,index=undefined) {
    return function(dispatch, getState) {
        return dispatch({type:types.CHANGE_DRAFTS,data:params,index})
    }
}
export function removeDrafts(params,index=undefined) {
    return function(dispatch, getState) {
        return dispatch({type:types.REMOVE_DRAFTS,data:params,index})
    }
}

/** 用户需要重新登录 */
function noUser(dispatch) {
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

