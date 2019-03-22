import { Platform } from "react-native";
import RNFS,{DocumentDirectoryPath,TemporaryDirectoryPath,CachesDirectoryPath} from 'react-native-fs';


class cacheManager  {
    static size = 0;
    static path = Platform.select({
        ios: TemporaryDirectoryPath+'/react-native-img-cache',
        android: CachesDirectoryPath+'/react-native-img-cache',
    })
    static clear = (path)=>{
        if (!path){
            path = this.path;
            if (!path) return;
        }
        RNFS.readDir(path).then(async result=>{
            if (result && Array.isArray(result) && result.length){
                for (let index = 0; index < result.length; index++) {
                    const item = result[index];
                    await RNFS.unlink(item.path)
                }
            }
            resolve()
        },error=>reject(error))
        .catch(error=>reject(error)) 
    }
    
    static getCacheSize = (path)=>{
        if (!path) {
            path = this.path;
            if (!path) return Promise.resolve(0);
        }
        let totalSize = 0
        let solve = (resolve,reject)=>{
            RNFS.readDir(path).then(async result=>{
                if (result && Array.isArray(result) && result.length){
                    for (let index = 0; index < result.length; index++) {
                        const item = result[index];
                        if(item.isFile()) {
                            totalSize += item.size;
                        }else if(item.isDirectory()){
                            try {
                                let dirsize = await this.readdirsize(item.path)
                                totalSize += dirsize;
                            } catch (error) {
                                console.log('cache dir read is error -------- ' ,error)
                            }
                        }
                    }
                    console.log(`get cache size : ${path} ${result.length}项 ==> ${totalSize}`)
                }
                resolve(totalSize)
            },error=>reject(error))
            .catch(error=>reject(error)) 
        }
        return new Promise(solve)
    }

    static readdirsize = (path)=>{
        return new Promise((resolve,reject)=>{
            RNFS.readDir(path).then(result=>{
                let totalSize = 0;
                result.map(async item=>{
                    if(item.isFile()) {
                        totalSize += item.size;
                    }else if(item.isDirectory()){
                        let dirsize = await this.readdirsize(item.path)
                        totalSize += dirsize;
                    }
                })
                resolve(totalSize)
            },error=>reject(error))
            .catch(error=>reject(error))
        })
    }
}

export default cacheManager;
