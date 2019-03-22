import {GET,POST} from '../fetchTool';

class loginApi {
    static getToken(account,pwd) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=login`,{account:account,pwd:pwd})
    }
    static thirdLogin(params){
        return POST('http://api.ulapp.cc/index.php?m=home&c=news&a=thirdlogin',params)
    }

}
export default loginApi;