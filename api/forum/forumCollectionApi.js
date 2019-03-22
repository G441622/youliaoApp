import {GET,POST} from "../fetchTool";

class forumCollectionApi {
    static getForumCollection(forum_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=collectionforum`,forum_id,true,false)
    }
    static getForumLike(forum_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=collectionnews`,forum_id,true,false)
    }
}
export default forumCollectionApi;