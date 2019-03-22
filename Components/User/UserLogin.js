import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Platform ,Alert} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as loginAction  from '../../actions/user/loginAction';
import * as userAction  from '../../actions/user/userAction';
import * as codeAction  from '../../actions/user/codeAction';
import * as commonAction  from '../../actions/common/commonAction';
import UMShare from '../../services/share';
import SharePlatform from '../../services/SharePlatform';
import SubHeader from '../Mould/SubHeader';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    scroll:{
        flex:1,
        backgroundColor:'white'
    },
    login_logo:{
        alignItems:'center',
        justifyContent:'center',
        margin:32
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
        flexDirection: 'row'
    },
    phone_number:{ 
        flex:4,
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
        flex:2, alignItems:'center',justifyContent:'center'
    },
    send_text:{
        textAlign:'center'
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
    forget:{
        textAlign:'right',
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
        alignItems:'center',justifyContent:'center'
    },
    login_img_qq:{
        height:40,
        width:40,
    },
    else_login_bottom:{flex:1,
        flexDirection: 'row'},
    login_account:{
        color:'#D34D3D',
        marginRight:20
    },
    modalStyle: {
        flex:1,
        backgroundColor: '#0008',
        justifyContent:'center',
        alignItems:'center'
    },
    prompt:{
        fontSize:setFontSize(15),
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
        ...Platform.select({
            ios: {
                borderBottomWidth:StyleSheet.hairlineWidth,
                borderBottomColor:'#aaa',
                marginBottom:8,
                marginTop:12
            }
        })
    }
});


class UserLogin extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader title='登录' navigation={navigation}/>,
            tabBarVisible: false,
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            see:true,
            forget:false,
            login:{
                phone:'',
                password:'',
            },
            tip:null
        };
        this.onRegisterPress = this.onRegisterPress.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);
        this.onPhoneChangeText = this.onPhoneChangeText.bind(this);
        this.onPasswordChangeText = this.onPasswordChangeText.bind(this);
        this.onpasswordPress = this.onpasswordPress.bind(this);
        this.onfindpasswordPress = this.onfindpasswordPress.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.login){
            this.props.navigation.goBack()
        }
    }
    onOtherLogin(platform){
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
    onPhoneChangeText(text){
        var state = Object.assign({},this.state,{
            login:{
                phone: text,
                password: this.state.login.password
            }
        });
        this.setState(state);
    }
    onPasswordChangeText(text){
        var state = Object.assign({},this.state,{
            login:{
                phone: this.state.login.phone,
                password: text
            }
        });
        this.setState(state);
    }
    onRegisterPress(){
        this.props.navigation.navigate('UserRegister',{});
    }
    onNewsPress=()=>{
        // if (this.props.routes.length>1)
        this.props.navigation.goBack();
    }
    onLoginPress(){
        let phone=this.state.login.phone
        let password=this.state.login.password
        if (!phone || phone.length != 11) return  this.props.commonAction.showTip('请输入正确的手机号码')
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return  this.props.commonAction.showTip('请输入正确的手机号码');
        if (!password) return  this.props.commonAction.showTip('密码不能为空')
        this.props.loginAction.getToken(phone,password);
    }
    onfindpasswordPress(){
        let phone = this.state.forgetPhone
        if (!phone || phone.length != 11) return this.showTip('请输入正确的手机号码')
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return this.showTip('请输入正确的手机号码');
        this.setState({forget:false})
        this.props.codeAction.getCode({phone:phone});
        this.props.navigation.navigate('UserFindPassword',{phone});
    }
    onpasswordPress = ()=> {
        
    }
    onForgetPasswordPress = ()=>{
        this.setState({forget:true});
    }
    showTip = (tip)=>{
        this.setState({tip})
        this.tipTimer = setTimeout(()=> {
            this.setState({tip:null})
            clearTimeout(this.tipTimer)
        }, 1500);
    }
    onSeePress=()=>{
        let see=this.state.see
        this.setState({see:!see})
    }
    render() {
        return (
            <ScrollView style={styles.scroll} keyboardShouldPersistTaps='handled'>
                <View style={styles.login_logo}>
                    <Text style={styles.logo_text}>有料</Text>
                </View>
                <View style={styles.login_input}>
                    <View style={styles.phone}>
                        <TextInput style={styles.phone_number} placeholder="请输入手机号" value={this.state.login.phone} name="phone" onChangeText={this.onPhoneChangeText}></TextInput>
                    </View>
                    <View style={styles.code}>
                        <TextInput style={styles.code_number}placeholder="请输入密码" value={this.state.login.password}
                                secureTextEntry={this.state.see} type="password" name="password" onChangeText={this.onPasswordChangeText}></TextInput>
                        <TouchableOpacity style={{width:20,justifyContent:'center', alignItems:'center'}}onPress={()=>this.onSeePress()}>{this.state.see==true?<Icon name="eye-slash"  size={15}/>:<Icon name="eye"  size={15}/>}</TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.onForgetPasswordPress}>
                        <Text style={styles.forget}>忘记密码？</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.forget}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.modalStyle}>
                            <View style={{backgroundColor:'white',borderRadius:5,padding:20,width:300,}}>
                                <View><Text style={styles.prompt}>请输入您注册有料的手机号，系统将自动发送一条验证码给您</Text></View>
                                <View><TextInput  placeholder="填写您的手机号"
                                                ref='forgetPhoneInput'
                                                onChangeText={(forgetPhone)=>this.setState({forgetPhone})}
                                                style={styles.write_textput}
                                                placeholderTextColor={'#ccc'}
                                                ></TextInput></View>
                                <View style={styles.modal_Bottom}>
                                    <TouchableOpacity onPress={()=>this.setState({forget:false})} style={styles.cancel}><Text style={styles.canceltext}>取消</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={this.onfindpasswordPress} style={styles.confirm}><Text style={styles.confirmtext}>确定</Text></TouchableOpacity>
                                </View>
                                {this.state.tip &&<View style={{position:'absolute',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}><Text>{this.state.tip}</Text></View>}
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.login} onPress={this.onLoginPress}>
                        <View style={styles.login_view}><Text style={styles.login_text}>进入有料</Text></View>
                    </TouchableOpacity>
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
                        <TouchableOpacity onPress={this.onRegisterPress}><Text style={styles.login_account}>新用户注册</Text></TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onNewsPress()}><Text>随便看看</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


function mapStateToProps(state, ownProps){
    return {
        code: state.root.user.code,
        login: state.root.user.login,
        userdata: state.root.user.userdata,
        routes:state.nav.routes
    };
}
function mapDispatchToProps(dispatch){
    return {
        codeAction: bindActionCreators(codeAction, dispatch),
        loginAction: bindActionCreators(loginAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserLogin);
