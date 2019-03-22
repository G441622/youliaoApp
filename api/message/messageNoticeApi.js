import {GET,POST} from "../fetchTool";

class messageNoticeApi {
    static getMessageNotice(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=fansnoticelist`,input,true,false)
    }
    static getNoticeNumber() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=countfansnotice`,{},true,false)
    }
    static getNoticeDelete() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=delfansnotice`,{},true,false)
    }
}
export default messageNoticeApi;