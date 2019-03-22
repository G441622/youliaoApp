import {GET,POST,POSTFILE} from '../fetchTool';
import RNFS from 'react-native-fs';

class forumApi {
    static initCategory(){
		return GET('http://api.ulapp.cc/index.php?m=home&c=forum&a=getcategory')
	}
    static getForum(input) {
        return GET('http://api.ulapp.cc/index.php?m=home&c=forum&a=forumlist',input)
    }
    static uploadImage(forumfile){
        return POST('http://api.ulapp.cc/index.php?m=home&c=forum&a=uplaodpostfiles',{forumfile})
    }
    static uploadFile(forumfile){
        return new Promise((resolve,reject)=>{
            RNFS.stat(forumfile.path).then(filestat=>{
                if (filestat.size>20*1024*1024) reject('too large,filesize should <=20MB only')
                console.log(filestat)
                let type = forumfile.name.replace(/.*\.(.*)/,'$1')
                type = forumfile.name!=type?type:'mp4';
                type = forumfile.type?forumfile.type:'video/'+type;
                let file = {...forumfile,size:filestat.size,type}//forumfile.name.replace(/.*\.(.*)/,'video/$1')
                let uriCodeFile = {};
                for (const key in file) {
                    if (file.hasOwnProperty(key)) {
                        const value = file[key];
                        uriCodeFile[key] = encodeURI(value)
                    }
                }
                POSTFILE('http://api.ulapp.cc/index.php?m=home&c=forum&a=uplaodpostfiles',{forumfile:uriCodeFile}).then(resolve,reject)
            })
        })
        // return POST('http://api.ulapp.cc/index.php?m=home&c=forum&a=uplaodpostfiles',{forumfile})
    }
    static uploadVideo(forumfile) {
        return new Promise((resolve,reject)=>{
            RNFS.stat(forumfile.path).then(filestat=>{
                let file = {type:'video/mpeg4',size:filestat.size,...forumfile}//forumfile.name.replace(/.*\.(.*)/,'video/$1')
                POST('http://api.ulapp.cc/index.php?m=home&c=forum&a=uplaodpostfiles',{forumfile:file}).then(resolve,reject)
            })
        })
    }
    /**
     * 
     * @param {data(帖子数据)   location(位置)  title(标题)  cid(分类ID)  user_token} params 
     */
    static publish(params){
        return POST('http://api.ulapp.cc/index.php?m=home&c=users&a=makeforum',params,true)
    }
}
export default forumApi;