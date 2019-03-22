import * as types from './messageConstant';
import messageBulletinApi from '../../api/message/messageBulletinApi';


export function getMessageBulletin(input){
    return function(dispatch, getState){
        return messageBulletinApi.getMessageBulletin(input)
            .then(result => {
                dispatch({type:types.MESSAGE_BULLETIN, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}

export function getBulletinDetail(input){
    return function(dispatch, getState){
        return messageBulletinApi.getBulletinDetail(input)
            .then(result => {
                dispatch({type:types.MESSAGE_BULLETINDETAIL, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}