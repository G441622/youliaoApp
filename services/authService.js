import * as md5 from '../utility/md5';
import { AsyncStorage} from 'react-native';
import moment from 'moment'

export default class AuthService{
    static GetAuthToken(m,c){
        var date = moment().format('YYYY-MM-DD');
        var token = m + c + date;
        return md5.hex_md5(token)
    }

    static SetToken(token){
        AsyncStorage.setItem('token', token);
    }
}