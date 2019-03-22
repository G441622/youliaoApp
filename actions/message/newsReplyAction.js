import * as types from './messageConstant';
import newsReplyApi from '../../api/message/newsReplyApi';


export function getNewsReply(input){
    return function(dispatch, getState){
        return newsReplyApi.getNewsReply(input)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSREPLY, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getNewsReplyDelect(notice_id,index){
    return function(dispatch, getState){
        return newsReplyApi.getNewsReplyDelect(notice_id)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSREPLY_DELETE, data:result.info,index:index});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getReplyNumber(){
    return function(dispatch, getState){
        return newsReplyApi.getReplyNumber()
            .then(result => {
                dispatch({type:types.MESSAGE_REPLY_NUMBER, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getReplyNumberDelect(){
    return function(dispatch, getState){
        return newsReplyApi.getReplyNumberDelect()
            .then(result => {
                dispatch({type:types.MESSAGE_REPLY_NUMBERDELETE, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function replaceData() {
    return function(dispatch, getState) {
        dispatch({type:types.REPLACE_NEWS})
    }
}