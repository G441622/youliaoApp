import * as types from './messageConstant';
import newsCollectionApi from '../../api/message/newsCollectionApi';


export function getNewsCollection(input){
    return function(dispatch, getState){
        return newsCollectionApi.getNewsCollection(input)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSCOLLECTION, data:result.info});
            })
            .catch(error =>{
                console.log(error)
            });
};
}
export function getNewsCollectionNewsDelect(news_id,index){
    return function(dispatch, getState){
        return newsCollectionApi.getNewsCollectionNewsDelect(news_id)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSCOLLECTION_DELETE, data:result.info,index:index});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}
export function getNewsCollectionForumDelect(forum_id,index){
    return function(dispatch, getState){
        return newsCollectionApi.getNewsCollectionForumDelect(forum_id)
            .then(result => {
                dispatch({type:types.MESSAGE_NEWSCOLLECTION_DELETE, data:result.info,index:index});
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