import {store} from '../../App';
import {GET,POST} from '../fetchTool';
import RNFS from 'react-native-fs';

class userApi {
    static forgetPassword(phone,newPassword){
        return POST('http://api.ulapp.cc/index.php?m=home&c=news&a=RequestPassword',{account:phone,password:newPassword})
    }
    static changePassword(phone,newPassword){
        return POST('http://api.ulapp.cc/index.php?m=home&c=news&a=RequestPassword',{account:phone,password:newPassword})
    }
    static getUser(user_token) {
        return GET(`http://api.ulapp.cc/index.php?m=home&c=users&a=getuserinfo`,{user_token},false,false)
    }
    /**
     * 
     * @param {user_token  userinfo} params 
     */
    static bindThirdPartyAccount(params){
        return POST('http://api.ulapp.cc/index.php?m=home&c=users&a=binding',params,true)
    }
    static freeBindThirdPartyAccount(params){
        return POST('http://api.ulapp.cc/index.php?m=home&c=users&a=freebind',params,true)
    }
    static bindPhone(phone){
        return POST('http://api.ulapp.cc/index.php?m=home&c=users&a=bindingphone',{phone},true)
    }
    // static freeBindPhone(phone){
    //     return POST('')
    // }
    static hotSearchKeyword(){
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=gethotkeyword',{})
    }
    static placeholderSearchKeyword(){
        return GET('http://api.ulapp.cc/index.php?m=home&c=news&a=inputkeyword',{})
    }
    static changeAvatar(avatar){
        return new Promise((resolve,reject)=>{
            RNFS.stat(avatar.path).then(filestat=>{
                if (filestat.size>20*1024*1024) reject('too large,filesize should <=20MB only')
                let file = {...avatar,size:filestat.size,type:avatar.type?avatar.type:avatar.name.replace(/.*\.(.*)/,'image/$1')}
                POST('http://api.ulapp.cc/index.php?m=home&c=users&a=uploadavatar',{avatar:file},true).then(resolve,reject)
            })
        })
    }
    static changeBackground(background) {
        return new Promise((resolve,reject)=>{
            RNFS.stat(background.path).then(filestat=>{
                if (filestat.size>20*1024*1024) reject('too large,filesize should <=20MB only')
                let file = {...background,size:filestat.size,type:background.type?background.type:background.name.replace(/.*\.(.*)/,'image/$1')}
                POST('http://api.ulapp.cc/index.php?m=home&c=users&a=uploadbackgroundimage',{background:file},true).then(resolve,reject)
            })
        })
    }
    static attention(user_id){
        return new Promise((resolve,reject)=>{
            GET('http://api.ulapp.cc/index.php?m=home&c=users&a=attention',{user_id},true).then(responseJson=>{
                if (responseJson.code==200) store.dispatch({type:'ATTENTION',data:{user_id,status:0}})
                if (responseJson.code==201) store.dispatch({type:'ATTENTION',data:{user_id,status:1}})
                resolve(responseJson)
            },error=>{
                reject(error)
            })
        })
    }
    static vote(option_id){
        return GET('http://api.ulapp.cc/index.php?m=home&c=users&a=voted',{option_id},true)
    }
}
export default userApi;
