import {GET,POST} from "../fetchTool";

class newsReplyApi {
    static getNewsReply(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=noticelist`,input,true,false)
    }
    static getNewsReplyDelect(notice_id) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=deletecomnotice`,notice_id,true,false)
    }
    static getReplyNumber() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=countnotice`,{},true,false)
    }
    static getReplyNumberDelect() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=delcommentnotice`,{},true,false)
    }


}

export default newsReplyApi;