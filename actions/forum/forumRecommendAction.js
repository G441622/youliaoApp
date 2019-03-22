import * as types from './forumConstant';
import forumRecommendApi from '../../api/forum/forumRecommendApi';


export function getForumRecommend(forum){
    return function(dispatch, getState){
        return forumRecommendApi.getForumRecommend(forum)
            .then(result => {
                dispatch({type:types.GET_RECOMMEND_FORUM, data:result});
            })
            .catch(error =>{
                console.log(error)
            });
    };
}