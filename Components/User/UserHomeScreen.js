import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction  from '../../actions/user/userAction';
import * as codeAction  from '../../actions/user/codeAction';
import * as settingAction  from '../../actions/user/settingAction';
import * as commonAction from '../../actions/common/commonAction';
import * as cacheManager from 'react-native-http-cache';

const styles = StyleSheet.create({
    content:{
        backgroundColor:'#F9F9F9',
    },
    list_content:{
       /* marginTop:2,*/
    },
    userContainer:{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#f6f6f6',
        /*marginLeft:10,
        marginRight:10,*/
        padding: 10,
        flexDirection:'row',
        alignItems:'center'
    },
    /*borderBottom: {
        borderBottomWidth: 1
    },*/
    userText:{
        color:'#585858',
        fontSize:setFontSize(15),
    },
    userText_icon:{
        color:'#D34D3D',
        fontSize:setFontSize(15)
    },
    angleright:{
        position:'absolute',
        right:20,
        color:'#ddd',
        fontSize:setFontSize(25)
    },
    anglerighttext:{
        position:'absolute',
        right:40,
        color:'#ddd',
    },
    userTitleText:{
        fontSize:setFontSize(16),
        padding:10,
        color:'black',
        backgroundColor:'#F6F6F6',
        /*borderBottomWidth: 1,
        borderColor: '#ccc',*/
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

class UserHomeScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:null,
            title:'用户'
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            cache:'0 B',
            clearCache:false,
            phone:'',
            changePassword:false,
            tip:null,
        };
        this.onCachePress = this.onCachePress.bind(this)
        this.onPasswordPress = this.onPasswordPress.bind(this)
    }
    componentDidMount() {
        if (this.props.login){
            this.props.settingAction.getSetting(this.props.login);
        }
        this.getCache()
    }
    componentWillReceiveProps(nextProps) {
        this.getCache()
        if (!this.props.login&&nextProps.login) this.props.settingAction.getSetting(nextProps.login);
    }
    getCache = ()=>{
        cacheManager.getCacheSize().then(size=>{
            let KB = 1024
            let MB = 1024*1024
            let cache = (Math.floor((size)* 100)/100)+'B'
            if (size>KB) cache=(Math.floor((size/KB)* 100)/100)+'KB'
            if (size>MB) cache=(Math.floor((size/MB)* 100)/100)+'MB'
            this.setState({cache})
        })
    }
    onCachePress() {
        this.props.commonAction.showLoading()
        cacheManager.clearCache().then(success=>{
            this.props.commonAction.hideLoading()
            this.setState({cache:'0 B',clearCache:false})
        },error=>{
            this.props.commonAction.hideLoading()
            this.setState({clearCache:false})
        })
    }
    onPasswordPress() {
        if (this.props.login){
            let phone = this.state.phone
            let mobile_phone = this.props.userdata.mobile_phone
            if (!mobile_phone||mobile_phone=='') return this.props.commonAction.showTip('请绑定手机号')
            if (!phone || phone.length != 11) return this.props.commonAction.showTip('请输入正确的手机号码')
            if (!phone || phone.length != 11) return this.props.commonAction.showTip('请输入正确的手机号码')
            if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return this.props.commonAction.showTip('请输入正确的手机号码');
            if (mobile_phone!=phone) return this.props.commonAction.showTip('请输入绑定的手机号')
            this.props.codeAction.getCode({phone:phone});
            this.setState({changePassword:false})
            this.props.onPasswordPress(phone)
        }
    }
    showTip = (tip)=>{
        this.setState({tip})
        this.tipTimer = setTimeout(()=> {
            this.setState({tip:null})
            clearTimeout(this.tipTimer)
        }, 1500);
    }
    render() {
        return (
            <View style={styles.content}>
                <UserHeader
                    dynamicClick={this.props.dynamicClick}
                    loginClick={this.props.loginClick}
                    fansClick={this.props.fansClick}
                    followClick={this.props.followClick}
                    settingClick={this.props.settingClick}
                    onUserPagePress={this.props.onUserPagePress}/>
                <View style={styles.list_content}>
                    <TouchableOpacity style={styles.userContainer}  onPress={this.props.onBindingPress}>
                        <Text style={styles.userText}>  账号绑定设置</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userContainer}  onPress={()=>this.props.login ? this.setState({changePassword:true}):this.props.commonAction.showTip('未登录')}>
                        <Text style={styles.userText}>  修改密码</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.changePassword}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.modalStyle}>
                            <View style={{backgroundColor:'white',borderRadius:5,padding:20,width:300,}}>
                                <View><TextInput  placeholder="填写您的手机号码"
                                                onChangeText={(phone)=>this.setState({phone})}
                                                style={styles.write_textput}
                                                placeholderTextColor={'#ccc'}
                                                ></TextInput></View>
                                <View><Text style={styles.prompt}>{`为保障您的账号安全\n修改密码前请先验证手机号码`}</Text></View>
                                <View style={styles.modal_Bottom}>
                                    <TouchableOpacity onPress={()=>this.setState({changePassword:false})} style={styles.cancel}><Text style={styles.canceltext}>取消</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>this.onPasswordPress()} style={styles.confirm}><Text style={styles.confirmtext}>确定</Text></TouchableOpacity>
                                </View>
                                {this.state.tip &&<View style={{position:'absolute',width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}><Text>{this.state.tip}</Text></View>}
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.userContainer}  onPress={()=>this.setState({clearCache:true})}>
                        <Text style={styles.userText}>  清除缓存</Text>
                        <Text style={styles.anglerighttext}>{this.state.cache}</Text><Icon name="angle-right" style={styles.angleright}/>
                    </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.clearCache}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.modalStyle}>
                            <View style={{backgroundColor:'white',borderRadius:5,padding:20,width:300,}}>
                                <View><Text style={styles.prompt}>确定清除缓存吗？</Text></View>
                                <View style={styles.modal_Bottom}>
                                    <TouchableOpacity onPress={()=>this.setState({clearCache:false})} style={styles.cancel}><Text style={styles.canceltext}>取消</Text></TouchableOpacity>
                                    <TouchableOpacity onPress={this.onCachePress} style={styles.confirm}><Text style={styles.confirmtext}>确定</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity style={styles.userContainer}  onPress={this.props.onFontPress}>
                        <Text style={styles.userText}>  字体大小</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={styles.userContainer}  onPress={this.onRegisterPress}>
                        <Text style={styles.userText}>  夜读模式</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={styles.userContainer}  onPress={this.props.onDraftsPress}>
                        <Text style={styles.userText}>  草稿箱</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userContainer}  onPress={this.props.onSharePress}>
                        <Text style={styles.userText}>  我的分享</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userContainer}  onPress={this.props.onAboutPress}>
                        <Text style={styles.userText}>  关于我们</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {
        routeName: state.nav.routeName,
        userdata: state.root.user.userdata,
        login: state.root.user.login,
    };
}
function mapDispatchToProps(dispatch){
    return {
        codeAction: bindActionCreators(codeAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        settingAction:bindActionCreators(settingAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserHomeScreen);