import {GET,POST} from '../fetchTool';

class userShareApi {
    static getShareCode() {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getintegralcode`,{},true,false)
    }
    static getExchangeCode(code) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getregisterintegral`,code,true,false)
    }
    static getShareList(input) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getintegrallist`,input,true,false)
    }

}
export default userShareApi;