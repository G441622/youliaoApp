import * as types from './forumConstant';
import forumCollectionApi from '../../api/forum/forumCollectionApi';


export function getForumCollection(forum_id){
    return function(dispatch, getState){
        return forumCollectionApi.getForumCollection(forum_id)
            .then(result => {
                dispatch({type:types.GET_COLLECTION_FORUM, data:result});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}

export function getForumLike(forum_id){
    return function(dispatch, getState){
        return forumCollectionApi.getForumLike(forum_id)
            .then(result => {
                dispatch({type:types.GET_LIKE_FORUM, data:result});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}