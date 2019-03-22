import {GET,POST} from "../fetchTool";;

class userDynamicApi {
    static getUserDynamic(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getforum`,input,true,false)
    }
    static getUserDynamicDelete(forum_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=deleteforum`,forum_id,true,false)
    }
}
export default userDynamicApi;