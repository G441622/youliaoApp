import {GET,POST,dispatch} from "../fetchTool";

class userFansApi {
    static getUserFans(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=fanslist`,input,true,false)
    }
    // static attention(user_id){
    //     return GET('http://api.ulapp.cc/index.php?m=home&c=users&a=attention',{user_id},true)
    // }
}
export default userFansApi;