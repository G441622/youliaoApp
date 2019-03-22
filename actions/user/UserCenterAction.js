import * as types from './userConstant';
import UserCenterApi from '../../api/user/UserCenterApi';


export function getUserData(user_id){
    return function(dispatch, getState){
        return UserCenterApi.getUserData(user_id)
            .then(result => {
                dispatch({type:types.GET_DATA_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getUserPageData(){
    return function(dispatch, getState){
        return UserCenterApi.getUserPageData()
            .then(result => {
                dispatch({type:types.GET_PAGEDATA_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function setUserForum(input){
    return function(dispatch, getState){
        return UserCenterApi.getUserForum(input)
            .then(result => {
                dispatch({type:types.SET_FORUM_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}

export function replaceData() {
    return function(dispatch, getState) {
        dispatch({type:types.REPLACE_USER_FORUM})
    }

}
export function getUserForum(input){
    return function(dispatch, getState){
        return UserCenterApi.getUserForum(input)
            .then(result => {
                dispatch({type:types.GET_FORUM_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getUserPageForum(input){
    return function(dispatch, getState){
        return UserCenterApi.getUserForum(input)
            .then(result => {
                dispatch({type:types.GET_PAGEFORUM_USER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}