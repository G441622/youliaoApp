import * as types from './messageConstant';
import newsCommentApi from '../../api/message/newsCommentApi';


export function getNewsComment(input){
    return function(dispatch, getState){
        return newsCommentApi.getNewsComment(input)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSCOMMENT, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getNewsCommentDelect(notice_id,index){
    return function(dispatch, getState){
        return newsCommentApi.getNewsCommentDelect(notice_id)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSCOMMENT_DELETE, data:result.info,index:index});
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