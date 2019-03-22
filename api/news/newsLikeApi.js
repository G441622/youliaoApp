import {GET,POST} from "../fetchTool";

class newsLikeApi {
    static newsLike(id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=likenews`,{action:'news',id},true,false)
    }
}
export default newsLikeApi;