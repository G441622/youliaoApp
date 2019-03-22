import {GET,POST} from "../fetchTool";

class forumDetailApi {
    static getForumDetail(forum) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=forum&a=forumdetail`,forum,true,false)
    }

    static forumShare(forum) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=usershare`,forum,true,false)
    }
}
export default forumDetailApi;