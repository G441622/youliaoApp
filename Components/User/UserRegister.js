import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal,WebView,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registerAction  from '../../actions/user/registerAction';
import * as loginAction  from '../../actions/user/loginAction';
import * as userAction  from '../../actions/user/userAction';
import * as codeAction  from '../../actions/user/codeAction';
import * as commonAction  from '../../actions/common/commonAction';
import UMShare from '../../services/share';
import SharePlatform from '../../services/SharePlatform';
import SubHeader from '../Mould/SubHeader';
import Images from '../../imagesRequired';


const htmlHeader = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>`
const htmlEnd = `
</body>
</html>`
const styles = StyleSheet.create({
    scroll:{
        flex:1,
        backgroundColor:'white'
    },
    login_logo:{
        margin:32,
        alignItems:'center',
        justifyContent:'center'
    },
    logo_text:{
        fontSize:setFontSize(50),
        color:'#D34D3D'
    },
    login_input:{
        flex:1,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:5,
        margin:30,
        padding:10,
    },
    phone:{
        flex:1,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'flex-end'
    },
    phone_number:{ 
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
    send:{
        justifyContent:'center',
        marginBottom:8
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
    code:{  
        flex:1,flexDirection: 'row'
    },
    code_number:{
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
    login:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        marginTop:10,
    },
    login_view:{
        alignItems:'center',justifyContent:'center',width:'100%', borderRadius:3,
        height:40,
        backgroundColor:'#D34D3D',
    },
    login_text:{
        color:'white',
        fontSize:setFontSize(20),
        textAlign:'center'
    },
    agree:{
        textAlign:'center',
        fontSize:setFontSize(13),
        marginTop:10
    },
    else_login:{
        flex:1,
        alignItems:'center',justifyContent:'center',
        marginTop:30
    },
    else_login_tag:{flex:1,
        flexDirection: 'row',alignItems:'center',justifyContent:'center'},
    tag_line_left:{
        width:70,
        height:1,
        backgroundColor:'#ccc'

    },
    tag_line_text:{
        fontSize:setFontSize(15),
        marginLeft:10,
        marginRight:10
    },
    tag_line_right:{
        width:70,
        height:1,
        backgroundColor:'#ccc'
    },
    else_login_img:{flex:3,
        flexDirection: 'row'},
    login_img_view:{
        margin:10,
        alignItems:'center',
        justifyContent:'center'
    },
    login_img_qq:{
        height:40,
        width:40,
    },
    else_login_bottom:{
        flex:1,
        flexDirection: 'row'
    },
    login_account:{
        color:'#D34D3D',
        marginRight:20
    },
    sharemodalStyle:{
        flex:1,
       /* backgroundColor: '#0008',*/
        justifyContent :'center',
       /* marginVertical:100*/
    },
    header_view:{
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
    },
    header_text:{
        fontSize:setFontSize(20),
        paddingVertical:10,
        color:'black',
        textAlign:'center'
    },
    content_view:{
        marginHorizontal:20,
        marginVertical:20,
    },
    content_text:{
        fontSize:setFontSize(15),
    },
    sharemodal_Bottom:{
        padding:5,
        justifyContent: 'center',
        alignItems:'center',
        borderTopWidth:1,
        borderTopColor:'#ddd',


    },
    commentcanceltext:{
        fontSize:setFontSize(15),
        color:'#505050',
        color:'black',
    },
    cancel:{
        marginBottom:10,
    },
    webView:{
        flex:1
    }
});
class UserRegister extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title='注册' navigation={navigation}/>
        }
    }
    constructor(props, context){
        super(props, context);
        this.state = {
            show:false,
            see:true,
            modal:false,
            register:{
                phone:null,
                code:null,
                password:null,
            },
            text:true,
            time:60
        };
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.register||nextProps.login){
            this.onNewsPress()
        }
    }
    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    onCodePress = (text)=>{
        let phone = this.state.phone;
        if (!phone || phone.length != 11) return this.props.commonAction.showTip('请输入正确的手机号',5000)
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return this.props.commonAction.showTip('请输入正确的手机号',5000);
        this.props.codeAction.getCode({phone:this.state.register.phone});
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
    
    onOtherLogin = (platform)=>{
        UMShare.login(platform,(result)=>{
            if (typeof result == 'object'){
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
                this.props.loginAction.thirdLogin({
                    userinfo:JSON.stringify(Object.assign({},result,{platform:platformString}))
                })
            }else{
                let tip = '出现错误'
                if (typeof result == 'string') tip = result;
                this.props.commonAction.showTip(tip)
            }
        })
    }
    onRegisterPress = ()=>{
        let phonecode = this.props.code && this.props.code.hasOwnProperty('phonecode')?this.props.code.phonecode:''
        let phone=this.state.register.phone
        let code=this.state.register.code
        let password=this.state.register.password
        if (!phone || phone.length != 11) return  this.props.commonAction.showTip('请输入正确的手机号码')
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return  this.props.commonAction.showTip('请输入正确的手机号码');
        if (!code) return  this.props.commonAction.showTip('验证码不能为空')
        if (code!=phonecode) return  this.props.commonAction.showTip('验证码错误')
        if (!password) return  this.props.commonAction.showTip('密码不能为空')
        this.props.registerAction.getToken({account:this.state.register.phone,pwd:this.state.register.password});
    }
    onLoginPress = ()=>{
        this.props.navigation.goBack();
    }
    onNewsPress = ()=>{
        let routes = this.props.routes
        let route = routes[routes.length-2]
        if (!this.props.navigation.goBack(route.key)){
            this.props.navigation.goBack()
        }
    }
    onPhoneChangeText = (text)=>{
        var state = Object.assign({},this.state,{
            register:{
                phone: text,
                code:this.state.register.code,
                password: this.state.register.password
            }
        });
        this.setState(state);
    }
    onCodeChangeText = (text)=>{
        var state = Object.assign({},this.state,{
            register:{
                phone: this.state.register.phone,
                code:text,
                password: this.state.register.password
            }
        });
        this.setState(state);
    }
    onPasswordChangeText = (text)=>{
        var state = Object.assign({},this.state,{
            register:{
                phone: this.state.register.phone,
                code:this.state.register.code,
                password: text
            }
        });
        this.setState(state);
    }
    onagreePress = ()=>{
        this.setState({show:true})
        this.props.registerAction.getAgree();
    }
    oncancelPress = ()=>{
        this.setState({show:false})
    }
    onSeePress = ()=>{
        let see=this.state.see
        this.setState({see:!see})
    }
    render() {
        let content = this.props.registeragree && this.props.registeragree.content?this.props.registeragree.content:''
        
        if (content.indexOf('<html>')==-1) content = htmlHeader+content+htmlEnd;
        return (
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps='handled'>
                <View style={styles.login_logo}>
                    <Text style={styles.logo_text}>有料</Text>
                </View>
                <View style={styles.login_input}>
                    <View style={styles.phone}>
                        <TextInput style={styles.phone_number} placeholder="请输入手机号" value={this.state.register.phone} name="phone" onChangeText={this.onPhoneChangeText}></TextInput>
                        <TouchableOpacity style={styles.send} disabled={this.state.time<60} onPress={()=>this.onCodePress()}><Text style={this.state.time<60?styles.send_textdis:styles.send_text}>{this.state.time==60?'获取验证码':'倒计时'+this.state.time+'s'}</Text></TouchableOpacity>
                    </View>
                    <View style={styles.code}>
                        <TextInput style={styles.code_number}placeholder="请输入验证码" value={this.state.register.code} name="code" onChangeText={this.onCodeChangeText}></TextInput>
                    </View>
                    <View style={styles.code}>
                        <TextInput style={styles.code_number} placeholder="请设置密码"  secureTextEntry={this.state.see} value={this.state.register.password} name="password" onChangeText={this.onPasswordChangeText}></TextInput>
                        <TouchableOpacity style={{width:20,justifyContent:'center', alignItems:'center'}}onPress={()=>this.onSeePress()}>{this.state.see==true?<Icon name="eye-slash"  size={15}/>:<Icon name="eye"  size={15}/>}</TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.login} onPress={this.onRegisterPress}>
                        <View style={styles.login_view}><Text style={styles.login_text}>注册</Text></View>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={styles.agree}>注册即同意</Text><TouchableOpacity onPress={()=>this.onagreePress()}><Text  style={[styles.agree,{color:'#d34d3d'}]}> 用户协议和隐私条款 </Text></TouchableOpacity>
                    </View>
                </View>
                <View style={styles.else_login}>
                    <View style={styles.else_login_tag}>
                        <View style={styles.tag_line_left}></View>
                        <View><Text  style={styles.tag_line_text}>社交账号直接登录</Text></View>
                        <View style={styles.tag_line_right}></View>
                    </View>
                    <View style={styles.else_login_img}>
                    <TouchableOpacity style={styles.login_img_view} onPress={()=>this.onOtherLogin(SharePlatform.QQ)}><Image source={Images.qq} style={styles.login_img_qq}></Image></TouchableOpacity>
                    <TouchableOpacity style={styles.login_img_view} onPress={()=>this.onOtherLogin(SharePlatform.WECHAT)}><Image source={Images.wx} style={styles.login_img_qq}></Image></TouchableOpacity>
                    <TouchableOpacity style={styles.login_img_view} onPress={()=>this.onOtherLogin(SharePlatform.SINA)}><Image source={Images.wb} style={styles.login_img_qq}></Image></TouchableOpacity>
                </View>
                    <View style={styles.else_login_bottom}>
                        <TouchableOpacity onPress={this.onLoginPress}><Text style={styles.login_account}>已有账号登录</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onNewsPress()}><Text>随便看看</Text></TouchableOpacity>
                    </View>

                </View>
                <Modal
                    animationType='fade'
                /*  transparent={true}*/
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.sharemodalStyle}>
                        <View style={styles.header_view}><Text style={styles.header_text}>注册协议</Text></View>
                        <WebView
                            automaticallyAdjustContentInsets={true}
                            style={styles.webView}
                            source={{html: content,baseUrl:'http://www.ulapp.cc'}}
                            domStorageEnabled={true}
                            decelerationRate="normal"
                            startInLoadingState={true}
                            // scalesPageToFit={true}
                            // html={content}
                            // onLoadStart={(info)=>console.log(info.nativeEvent)}
                            // onError={(info)=>console.log(info.nativeEvent)}
                            // onLoad={(info)=>console.log(info.nativeEvent)}
                            // onLoadEnd={(info)=>console.log(info.nativeEvent)}
                        />
                        <TouchableOpacity style={styles.sharemodal_Bottom}onPress={()=>this.oncancelPress()} >
                            <View underlayColor='transparent' style={styles.cancel}><Text style={styles.commentcanceltext}>同意</Text></View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        routes:state.nav.routes,
        code: state.root.user.code,
        register: state.root.user.register,
        login: state.root.user.login,
        userdata: state.root.user.userdata,
        registeragree:state.root.user.registeragree,
    };
}
function mapDispatchToProps(dispatch){
    return {
        loginAction: bindActionCreators(loginAction, dispatch),
        codeAction: bindActionCreators(codeAction, dispatch),
        registerAction: bindActionCreators(registerAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserRegister);