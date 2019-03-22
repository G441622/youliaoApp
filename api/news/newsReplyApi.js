import {GET,POST} from '../fetchTool';
import {store} from '../../App';
import {emoticons} from '../../utility/index';

class newsReplyApi {
    static getNewsReply(newsId,input) {
        var user_id = ''
        try {
            var state = store.getState()
            var user_id = state.root.user.userdata.user_id;
        } catch (error) {
            console.log('error ; ',error)
        }
        let body = {
            user_id,
            ...input,
            news_id:newsId
        }
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=newscomment`,body)
            
    }
    static getNewsUserReplyPar(params){
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=parentcomment`,params,true,false)
    }
    static getNewsUserReply(params){
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=newscommentchild`,params)
    }
    static newsReply(params){
        let content = emoticons.stringify(params.content)
        params = {...params,content}
        return GET('http://api.ulapp.cc/index.php?m=home&c=users&a=comment',params,true);
    }
    /**
     * 
     * @param {*news_id(新闻ID)   comment_id(评论id) user_token} params 
     */
    static commentLike(params){
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=lknewscomment`,params,true)
    }
}


export default newsReplyApi;