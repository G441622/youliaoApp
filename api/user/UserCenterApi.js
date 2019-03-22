import {GET,POST} from "../fetchTool";

class UserCenterApi {
    static getUserData(user_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=getuserinfo`,user_id,true,false)
    }
    static getUserForum(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=getforum`,input,true,false)
    }
    static getUserPageData() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=getuserinfo`,{},false,true)
    }
    static getUserPageForum(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=getforum`,input,true,false)
    }
}
export default UserCenterApi;