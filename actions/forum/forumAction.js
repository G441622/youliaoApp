import * as types from './forumConstant';
import forumApi from '../../api/forum/forumApi';
import * as Storage from '../../data/Storage';
import _ from 'lodash';

export function getForum(input) {
    return function (dispatch, getState) {
        return forumApi.getForum(input)
            .then(result => {
                if (result.code != 200) return dispatch({ type: types.GET_FORUM_LIST, data: {}, cid: input.cid, key: input.key });
                dispatch({ type: types.GET_FORUM_LIST, data: result.info, cid: input.cid, key: input.key })
            })
            .catch(error => {

            });
    };
}


export function initCategory() {
    return function (dispatch, getState) {
        Storage.get('forumCategory').then(forumCategory=>{
            let state = getState()
            let reduxForumCategory = _.result(state,'root.forum.category',[]);
            if (reduxForumCategory.length) return;
            if (forumCategory&&Array.isArray(forumCategory)&&forumCategory.length){
                dispatch({type: types.INIT_FORUM_CATEGORY, data : forumCategory})
            }
        },error=>console.log(error))
        return forumApi.initCategory()
            .then(result => {
                if (result.code !== 200) return;
                Storage.save('forumCategory',result.info)
                dispatch({ type: types.INIT_FORUM_CATEGORY, data: result.info })
            })
    }
}