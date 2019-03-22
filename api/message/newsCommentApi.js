import {GET,POST} from "../fetchTool";

class newsCommentApi {
    static getNewsComment(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=commentlist`,input,true,false)
    }
    static getNewsCommentDelect(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=deletecomment`,input,true,false)
    }
}
export default newsCommentApi;