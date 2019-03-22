import {GET,POST} from "../fetchTool";
class userFollowApi {
    static getUserFollow(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=attentionlist`,input,true,false)
    }
}
export default userFollowApi;