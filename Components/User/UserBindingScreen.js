import React from 'react';
import { StyleSheet, Text, View,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Switch,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader';
import SharePlatform from '../../services/SharePlatform';
import UMShare from '../../services/share';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction  from '../../actions/user/userAction';
import * as codeAction  from '../../actions/user/codeAction';
import * as commonAction from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';
import _ from 'lodash';

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    list:{
       /* marginTop:10,*/
    },
    list_view:{
        marginBottom:1,
        backgroundColor:'white',
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        alignItems:'center'
    },
    text_title:{
        fontSize:setFontSize(15),
        padding:15,
    },
    third_name:{
        marginLeft:20,
        fontSize:setFontSize(14),
        color:'#ccc'
    },
    text:{
        fontSize:setFontSize(15),
        padding:15,
        color:'#ccc',
        position:'absolute',
        right:0
    },
    modalStyle: {
        flex:1,
        backgroundColor: '#0008',
        justifyContent:'center',
        alignItems:'center'
    },
    modal_title:{
        fontSize:setFontSize(17),
    },
    prompt:{
        fontSize:setFontSize(13),
        color:'#ccc',
        marginTop:10,
        marginBottom:10,
    },
    modal_Bottom:{
        flexDirection:'row',
        justifyContent: 'flex-end',
    },
    cancel:{
        margin:5,
    },
    confirm:{
        margin:5,
    },
    canceltext:{
        padding:5,
        fontSize:setFontSize(15)
    },
    confirmtext:{
        color:'#d34d3d',
        fontSize:setFontSize(15),
        padding:5,
    },
    write_textput:{
        flex:1,
        ...Platform.select({
            ios: {
                borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor:'#aaa',
                marginBottom:8,
                marginTop:12
            }
        })
    },
    input:{
        flexDirection: 'row',
        alignItems:'center'
    },
    send:{
        justifyContent:'center'
    },
    send_text:{
        textAlign:'center',
        borderWidth:1,borderColor:'#ccc',padding:10,borderRadius:3,paddingVertical:7,
    },
    send_textdis:{
        textAlign:'center',
        padding:10,borderRadius:3,backgroundColor:'#f6f6f6',paddingVertical:7,
        color:'#ddd'
    },
});


class UserBindingScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'账号绑定设置'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            phoneNumber:null,
            code:null,
            show:false,
            wx:false,
            qq:false,
            wb:false,
            phone:false,
            time:60
        };
    }
    componentDidMount() {
        try {
            let {third_qq,third_wb,third_wx,phone} = this.props.userdata;
            this.setState({qq:third_qq==0,wb:third_wb==0,wx:third_wx==0,phone:phone==0})
        } catch (error) {
            console.log(error)
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.userdata){
            let {third_qq,third_wb,third_wx,phone} = nextProps.userdata;
            this.setState({qq:third_qq==0,wb:third_wb==0,wx:third_wx==0,phone:phone==0})
        }
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
    onBindPress = (platform)=> {
        UMShare.login(platform,(result)=>{
            if (typeof result == 'object'){
                var platformString = this.switchPlatform(platform)
                // 绑定账号
                // 服务器端userdata需要添加的字段: bindWechat? bindQQ? bindSina? user_name(phone)? sex? age? sign(introduce`)?
                let {uid,name,gender,iconurl,...other} = result;
                if (!uid||!name) return this.props.commonAction.showTip('出现错误');
                let params = {uid,name,gender,iconurl,platform:platformString}
                this.props.userAction.bindThirdPartyAccount({userinfo:JSON.stringify(params)})
            }else{
                let tip = '出现错误'
                if (typeof result == 'string') tip = result;
                this.props.commonAction.showTip(tip)
            }
        })
    }
    switchPlatform = (platform)=>{
        var platformString = ''
        switch (platform) {
            case SharePlatform.QQ:
            case SharePlatform.QQZONE:
                platformString = 'qq'
                break;
            case SharePlatform.SINA:
                platformString = 'wb'
                break;
            case SharePlatform.WECHAT:
                platformString = 'wx'
                break;
            default:
                break;
        }
        return platformString;
    }

    onChangeBind = (value,platform)=>{
        if (value){
            this.onBindPress(platform)
        }else{
            let action = this.switchPlatform(platform)
            let {wx,wb,qq,phone} = this.state;
            let binds = _.compact([wx,wb,qq,phone])
            if (binds.length <= 1) return this.props.commonAction.showTip('不能解除绑定状态');
            this.props.userAction.freeBindThirdPartyAccount({action})
        }
    }

    onCodePress = (text)=>{
        let phone = this.state.phoneNumber;
        if (!phone || phone.length != 11) return this.props.commonAction.showTip('请输入正确的手机号',5000)
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return this.props.commonAction.showTip('请输入正确的手机号',5000);
        this.props.codeAction.getCode({phone});
        if (this.timer) return;
        this.timer = setInterval(()=>{
            if (this.state.time==0) {
                this.setState({ text:!this.state.text,time:10});
                clearInterval(this.timer)
                this.timer = null;
            }else {
                this.setState(({time:this.state.time-1}))
            }
        },1000)
    }
    onBind = ()=>{
        if (this.state.show){
            let phone = this.state.phoneNumber;
            if (!this.props.code) return;
            if (this.state.code == this.props.code.phonecode){
                this.props.userAction.bindPhone(phone)
            }else{
                this.props.commonAction.showTip('验证码不正确')
            }
        }else{
            !this.state.phone&&this.setState({show:true})
        }
    }
    onChangePhoneBind = (value)=>{
        if (value) {
            this.setState({show:true})
        }else{
            this.props.commonAction.showTip('不能解绑手机号')
        }
    }
    render() {
        let {qq,wx,wb,phone} = this.state
        let qq_name = qq?this.props.userdata.qq_name:'';
        let wx_name = wx?this.props.userdata.wx_name:'';
        let wb_name = wb?this.props.userdata.wb_name:'';
        let mobile_phone = phone?this.props.userdata.mobile_phone:'';

        return (
            <View style={styles.content}>
                <View style={styles.list}>
                    <TouchableOpacity style={styles.list_view} disabled={this.state.wx} onPress={()=>this.onBindPress(SharePlatform.WECHAT)}>
                        <Text style={styles.text_title}>微信号<Text style={styles.third_name}>{`  ${wx_name}`}</Text></Text>
                        <Switch style={{marginRight:20}}  value={this.state.wx} onTintColor='#0c0' onValueChange={value=>this.onChangeBind(value,SharePlatform.WECHAT)}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.list_view} disabled={this.state.qq} onPress={()=>this.onBindPress(SharePlatform.QQ)}>
                        <Text style={styles.text_title}>QQ号<Text style={styles.third_name}>{`  ${qq_name}`}</Text></Text>
                        <Switch style={{marginRight:20}}  value={this.state.qq} onTintColor='#0c0' onValueChange={value=>this.onChangeBind(value,SharePlatform.QQ)}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.list_view} disabled={this.state.wb} onPress={()=>this.onBindPress(SharePlatform.SINA)}>
                        <Text style={styles.text_title}>新浪微博<Text style={styles.third_name}>{`  ${wb_name}`}</Text></Text>
                        <Switch style={{marginRight:20}}  value={this.state.wb} onTintColor='#0c0' onValueChange={value=>this.onChangeBind(value,SharePlatform.SINA)}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.list_view} disabled={this.state.phone} onPress={this.onBind}>
                        <Text style={styles.text_title}>手机号<Text style={styles.third_name}>{`  ${mobile_phone}`}</Text></Text>
                        <Switch style={{marginRight:20}}  value={this.state.phone} onTintColor='#0c0' onValueChange={value=>this.onChangePhoneBind(value)}/>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                        <View style={styles.modalStyle}>
                            <View style={{backgroundColor:'white',borderRadius:5,padding:20,width:300}}>
                                <View><Text style={styles.modal_title}>绑定手机号</Text></View>
                                <View><Text style={styles.prompt}>填写完手机号后，点击获取验证码，我们将自动发送一条短信给您</Text></View>
                                <View style={styles.input}>
                                    <TextInput  placeholder="填写您的手机号"
                                                onChangeText={phoneNumber=>this.setState({phoneNumber})}
                                                style={styles.write_textput}
                                                placeholderTextColor={'#ccc'}
                                                maxLength={11}
                                                />
                                    <TouchableOpacity style={styles.send} disabled={this.state.time<60} onPress={this.onCodePress}><Text style={this.state.time<60?styles.send_textdis:styles.send_text}>{this.state.time==60?'获取验证码':'倒计时'+this.state.time+'s'}</Text></TouchableOpacity>
                                </View>
                                <View style={styles.input}>
                                    <TextInput  placeholder="填写收到的验证码"
                                                onChangeText={code=>this.setState({code})}
                                                style={styles.write_textput}
                                                placeholderTextColor={'#ccc'}
                                                />
                                </View>
                                <View style={styles.modal_Bottom}>
                                    <TouchableOpacity onPress={()=>this.setState({show:false})} style={styles.cancel}><Text style={styles.canceltext}>取消</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>this.onBind()} style={styles.confirm}><Text style={styles.confirmtext}>确定</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {
        userdata: state.root.user.userdata,
        login: state.root.user.login,
        code: state.root.user.code
    };
}
function mapDispatchToProps(dispatch){
    return {
        codeAction: bindActionCreators(codeAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserBindingScreen)