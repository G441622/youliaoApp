import * as types from './messageConstant';
import messageNoticeApi from '../../api/message/messageNoticeApi';


export function getMessageNotice(input){
    return function(dispatch, getState){
        return messageNoticeApi.getMessageNotice(input)
            .then(result => {
                dispatch({type:types.MESSAGE_NOTICE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getNoticeNumber(){
    return function(dispatch, getState){
        return messageNoticeApi.getNoticeNumber()
            .then(result => {
                dispatch({type:types.MESSAGE_NOTICE_NUMBER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getNoticeDelete(){
    return function(dispatch, getState){
        return messageNoticeApi.getNoticeDelete()
            .then(result => {
                dispatch({type:types.MESSAGE_NOTICE_DELETE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}