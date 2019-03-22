import {GET,POST} from '../fetchTool';

class codeApi {
    static getCode(params) {
        var code=MathRand();
        params.code = code;
        return GET(`http://api.ulapp.cc/index.php?m=home&c=news&a=sendphonecode`,params,false,false)
    }
}
function MathRand()
{
    var Num="";
    for(var i=0;i<6;i++)
    {
        Num+=Math.floor(Math.random()*9);
    }
    return Num;
}
export default codeApi;