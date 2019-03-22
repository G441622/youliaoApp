import * as types from './forumConstant';
import forumDetailApi from '../../api/forum/forumDetailApi';


export function getForumDetail(forum){
    return function(dispatch, getState){
        return forumDetailApi.getForumDetail(forum)
            .then(result => {
                dispatch({type:types.GET_DETAIL_FORUM, data:result.info});
            })
            .catch(error =>{
               console.log(error)
            });
    };
}