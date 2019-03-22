import React from 'react';
import { StyleSheet, Text, View, NativeModules,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader';
import DeviceInfo from 'react-native-device-info';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as commonAction from '../../actions/common/commonAction';
import { GET } from "../../api/fetchTool" ;
import Images from '../../imagesRequired';
import SubHeader from '../Mould/SubHeader';


const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    header:{
      height:200,
        justifyContent:'center',
      alignItems:'center'
    },
    header_img:{
        height:80,
        width:80,
        borderRadius:5,
    },
    header_text:{
        fontSize:setFontSize(20),
        color:'#585858',
        marginTop:15,
    },
    list:{
        /*marginTop:10,*/
    },
    list_view:{
        marginBottom:1,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    text_title:{
        fontSize:setFontSize(15),
        padding:15,
    },
    text:{
        fontSize:setFontSize(20),
        paddingRight:15,
        color:'#ccc',
        // lineHeight:35,
        // backgroundColor:'red'
    },
    angle:{
        fontSize:setFontSize(25),
    },
    bottom:{
        marginTop:80,
        alignItems:'center'
    },
    bottomtext:{
        color:'#ccc',
        fontSize:setFontSize(12),
        textAlign:'center'
    },
});

class UserAboutScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'关于我们'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.onUserCenterPress = this.onUserCenterPress.bind(this);
        this.state = {
            version : DeviceInfo.getVersion(),
            updateVersion:undefined,
            shouldUpdate:false,
            build:undefined,
            description:undefined,
            time:undefined,
            downloading:false,
            url:undefined
        }
    }
    componentDidMount() {
        GET('http://api.ulapp.cc/index.php?m=home&c=news&a=edition',{action:Platform.OS})
        .then(responseJson=>{
            console.log(responseJson)
            if (responseJson.code ==200){
                let updateVersion = responseJson.info.edition_code;
                let time = responseJson.info.edition_time;
                let description = responseJson.info.edition_explain;
                let _id = responseJson.info.edition_id;
                let shouldUpdate = this.state.version != updateVersion;
                let url = responseJson.info.download_url
                let state = {time,updateVersion,description,url,shouldUpdate}
                this.setState(state)
                console.log(state)
            }
        },error=>console.log(error))
    }
    onUserCenterPress(){
        // this.props.navigation.navigate('UserCenter',{});
    }
    
    onUpdatePress = ()=>{
        if (this.state.shouldUpdate){
            if (Platform.OS == 'android'){
                /**
                 *  com.android.vending                 Google Play
                    com.tencent.android.qqdownloader    应用宝
                    com.qihoo.appstore                  360手机助手
                    com.baidu.appsearch                 百度手机助
                    com.xiaomi.market                   小米应用商店
                    com.wandoujia.phoenix2              豌豆荚
                    com.huawei.appmarket                华为应用市场
                    com.taobao.appcenter                淘宝手机助手
                    com.hiapk.marketpho                 安卓市场
                    cn.goapk.market                     安智市场
                */
                const DeviceUtiliy = NativeModules.DeviceUtiliy;
                // apk包名    market包名(为空,则在所有的market中选择)
                DeviceUtiliy.openMarket('cc.ulapp.gongming','')//
                // if (this.state.downloading) return;
                // DeviceUtiliy.startDownLoad('http://www.wandoujia.com/apps/com.github.client/binding?source=web_seo_baidu_binded','')
                // this.setState({downloading:true})
            }else if(Platform.OS == 'ios'){

            }
        }else{
            this.props.commonAction.showTip('已经是最新版本')
        }
    }
    onUserAboutUsPress=()=>{
        this.props.navigation.navigate('UserAboutUs',{});
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image source={Images.logo} style={styles.header_img} />
                    <Text style={styles.header_text}>有料 v {this.state.version}</Text>
                    {this.state.build&&<Text>{`( ${this.state.build} )`}</Text>}
                </View>
                <View style={styles.list}>
                    <TouchableOpacity style={styles.list_view} onPress={this.onUserAboutUsPress}>
                        <Text style={styles.text_title}>关于我们</Text>
                        <Text style={styles.text}><Icon name="angle-right" style={styles.angle}/></Text>
                    </TouchableOpacity>
                    {Platform.OS != 'ios' &&<TouchableOpacity style={styles.list_view} onPress={this.onUpdatePress}>
                        <Text style={styles.text_title}>版本更新</Text>
                        <Text style={styles.text}><Icon name="angle-right" style={styles.angle}/></Text>
                        {/* {this.state.shouldUpdate?this.state.updateVersion:''}    */}
                    </TouchableOpacity>
                    }
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.bottomtext}>Copyright © 2016-2017 youliao</Text>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        commonAction:bindActionCreators(commonAction,dispatch),
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(UserAboutScreen);