import {GET,POST} from '../fetchTool';
import {store} from '../../App';
import {emoticons} from '../../utility/index';

class forumReplyApi {
    static getForumReply(forumId,input) {
        var user_id = '' // option
        try {
            var state = store.getState()
            user_id = state.root.user.userdata.user_id;
        } catch (error) {
            console.log('error ; ',error)
        }
        let body = {
            user_id,
            ...input,
            forum_id:forumId
        }
        return GET(`http://api.ulapp.cc/index.php?m=home&c=forum&a=forumcomment`,body)
            
    }
    static getForumUserReply(params){
        return GET(`http://api.ulapp.cc/index.php?m=home&c=forum&a=forumcommentchild`,params)
    }
    static forumReply(params){
        let content = emoticons.stringify(params.content)
        params = {...params,content}
        return GET('http://api.ulapp.cc/index.php?m=home&c=users&a=forumcomment',params,true);
    }
    /**
     * 
     * @param {*comment_id(评论id) user_token} params 
     */
    static commentLike(params){
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=likeforumcomment`,params,true)
    }
}


export default forumReplyApi;