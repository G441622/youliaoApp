import * as types from './forumConstant';
import forumReplyApi from '../../api/forum/forumReplyApi';

export function setForumReply(forumId,input){
    return function(dispatch, getState){
        return forumReplyApi.getForumReply(forumId,input)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.SET_REPLY_FORUM, data:result.info});
                }
            })
            .catch(error =>{
                console.log('catch : ',error)
            });
    };
}
/**
 * 
 * @param {pid:'评论pid',page:'页数',limit:'数量'} params 
 */
export function setForumUserReply(params){
    return function(dispatch, getState){
        return forumReplyApi.getForumUserReply(params)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.SET_REPLY_USER_FORUM, data:result.info});
                }
            })
            .catch(error =>{
                console.error(error)
            });
    };
}

export function getForumReply(forumId,input){
    return function(dispatch, getState){
        return forumReplyApi.getForumReply(forumId,input)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.GET_REPLY_FORUM, data:result.info});
                }
            })
            .catch(error =>{
                console.log('catch : ',error)
            });
    };
}
/**
 * 
 * @param {pid:'评论pid',page:'页数',limit:'数量'} params 
 */
export function getForumUserReply(params){
    return function(dispatch, getState){
        if (params.page==0) return dispatch({type:types.SET_REPLY_USER_FORUM, data:params.data})
        return forumReplyApi.getForumUserReply(params)
            .then(result => {
                if (result.code == 200 && result.hasOwnProperty('info') && typeof(result.info) == 'object'){
                    dispatch({type:types.GET_REPLY_USER_FORUM, data:result.info});
                }
            })
            .catch(error =>{
                console.error(error)
            });
    };
}

/**
 * 
 * @param {forum_id(新闻ID)  commented_userid(被评论者id 如果是一级评论则是0) pid(如果是一级评论则是0 二级评论带上上一级评论id) content(评论内容)} params 
 */
export function forumReply(params={forum_id:'',commented_userid:0,pid:0,content:''}){
    return function(dispatch, getState){
        return forumReplyApi.forumReply(params)
            .then(result=>{
                if (result.code==200){
                    let state = getState()
                    let data = {...result.info,time:'刚刚',user_name:result.info.alias,user_avatar:state.root.user.userdata.user_avatar}                    
                    if (params.commented_userid){
                        if (state.root.forum.forumUserReply.commentchild.data.length){
                            dispatch(setForumUserReply({
                                pid: state.forum.forumUserReply.comment_id,
                                page:1,
                                limit:10
                            }))
                            dispatch({type:types.FORUM_USER_REPLY,data})
                        }else{
                            dispatch(setForumReply(state.root.forum.forumDetail.id,{
                                page:1,
                                limit:15,
                                childcount:10,
                            }))
                        }
                    }else{
                        dispatch(setForumReply(state.root.forum.forumDetail.id,{
                            page:1,
                            limit:15,
                            childcount:10,
                        }))
                        dispatch({type:types.FORUM_REPLY,data})
                    }
                }
            })
    }
}
export function replaceReply(){
    return function(dispatch, getState){
        dispatch({type:types.REPLACE_FORUM_REPLY})
    }
}
export function replaceUserReply(){
    return function(dispatch, getState){
        dispatch({type:types.REPLACE_FORUM_REPLY_USER})
    }
}

export function updateForumReply(forum_id) {
    return function(dispatch, getState) {
        dispatch({type:types.UPDATE_FORUM_REPLY,data:forum_id})
    }
}
export function updatedForumReply() {
    return function(dispatch, getState) {
        dispatch({type:types.UPDATED_FORUM_REPLY})
    }
}