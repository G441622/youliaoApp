import {GET,POST} from "../fetchTool";

class forumLikeApi {
    static forumLike(id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=likenews`,{action:'forum',id},true,false)
    }
}
export default forumLikeApi;