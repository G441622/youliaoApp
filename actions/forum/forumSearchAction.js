import * as types from './forumConstant';
import forumSearchApi from '../../api/forum/forumSearchApi';


export function getForumSearch(input){
    return function(dispatch, getState){
        return forumSearchApi.getForumSearch(input)
            .then(result => {
                let data = typeof result == 'object'&&result.hasOwnProperty('info')&&result.info?result.info:{PresentPage:0,data:[]}
                // if (result.code!=200) return dispatch({type:types.GET_SEARCH_FORUM, data});
                dispatch({type:types.GET_SEARCH_FORUM, data});
            })
            .catch(error =>{

            });
    };
}