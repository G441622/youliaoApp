import {GET,POST} from "../fetchTool";

class settingApi {
    static postSetting(input) {
        return POST(`http://api.ulapp.cc/index.php?m=home&c=users&a=updateuserinfo`,input,true)
    }
    static getSetting(token) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getuserallinfo`,{},true)
    }
}

export default settingApi;