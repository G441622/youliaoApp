import {GET,POST} from "../fetchTool";

class messageBulletinApi {
    static getMessageBulletin(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=announcement`,input,true,false)
    }
    static getBulletinDetail(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=announcementdetail`,input,true,false)
    }
}
export default messageBulletinApi;