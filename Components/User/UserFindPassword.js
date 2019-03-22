import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as codeAction  from '../../actions/user/codeAction';
import * as userAction  from '../../actions/user/userAction';
import * as commonAction  from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    promptview:{
        padding:15,
    },
    prompt:{
        fontSize:setFontSize(14),
    },
    input:{
        paddingHorizontal:20,
        backgroundColor:'white'
    },
    bottom:{
        padding:15,
        marginTop:10,
    },
    button:{
        borderRadius:2,
        backgroundColor:'#d34d3d',
        alignItems:'center'
    },
    buttontext:{
        fontSize:setFontSize(17),
        color:'white',
        textAlign:'center',
        padding:5,
    },
    write_textput:{
        padding:0,
        paddingVertical:10,
        margin:0,
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

class UserFindPassword extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'修改密码'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor (props) {
        super(props)
        this.state={
            code:null,
            getCode:false,
            newPassword:null,
            newPasswordCheck:null
        }
    }
    componentWillReceiveProps = (nextProps) => {
        let {code,getCode,newPassword,newPasswordCheck} = this.state;
        // if (code==null||getCode==false||newPassword==null||newPasswordCheck==null) return;
        if (nextProps.forgetPassword||nextProps.changePassword||(this.props.code&&!nextProps.code)){
            this.props.navigation.goBack()
        }
    }
    componentWillUnmount() {
        this.props.navigation.dispatch({type:'REPLACE_PHONE_CODE'})
    }
    resendCode = ()=>{
        try {
            let phone = this.props.navigation.state.params.phone;
            this.props.codeAction.getCode({phone:phone})
            this.getCode()
        } catch (error) {
            this.props.navigation.goBack()
        }
    }
    getCode =()=>{
        this.setState({getCode:true})
        this.getCodeTimer = setTimeout(()=>{
            this.setState({getCode:false})
            clearTimeout(this.getCodeTimer)
        },60)
    }
    complete = ()=>{
        let phone = this.props.navigation.state.params.phone;
        if (!phone) phone=this.props.code.phone;
        if (!this.state.code || this.state.code != this.props.code.phonecode) return this.props.commonAction.showTip('验证码不正确',2000)
        if (!this.state.newPassword || !this.state.newPasswordCheck || this.state.newPassword.length < 6) return this.props.commonAction.showTip('密码最短为六位',2000)
        if (this.state.newPassword != this.state.newPasswordCheck) return this.props.commonAction.showTip('密码不一致',2000)
        this.props.userAction.forgetPassword(phone,this.state.newPassword)
    }
    render() {
        return (
            <View style={styles.content}>
                <View style={styles.promptview}>
                    <Text style={styles.prompt}>请输入验证码设置新密码，以保证下次正常登录</Text>
                </View>
                <View style={styles.input}>
                    <TextInput  placeholder="请输入验证码"
                                style={styles.write_textput}
                                onChangeText={code=>this.setState({code})}
                                placeholderTextColor={'#ccc'}
                                underlineColorAndroid={'transparent'}
                                ></TextInput>
                </View>
                <View style={styles.input}>
                    <TextInput  placeholder="请输入新密码"
                                style={styles.write_textput}
                                onChangeText={(newPassword)=>this.setState({newPassword})}
                                placeholderTextColor={'#ccc'}
                                secureTextEntry={true}
                                underlineColorAndroid={'transparent'}
                                ></TextInput>
                </View>
                <View style={styles.input}>
                    <TextInput  placeholder="请输入新密码"
                                style={styles.write_textput}
                                onChangeText={(newPasswordCheck)=>this.setState({newPasswordCheck})}
                                placeholderTextColor={'#ccc'}
                                secureTextEntry={true}
                                underlineColorAndroid={'transparent'}
                                ></TextInput>
                </View>
                <View style={styles.bottom}>
                    <TouchableOpacity style={styles.button} onPress={this.complete}><Text style={styles.buttontext}>完成</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        code: state.root.user.code,
        forgetPassword:state.root.user.forgetPassword,
        changePassword:state.root.user.changePassword
    };
}
function mapDispatchToProps(dispatch){
    return {
        codeAction: bindActionCreators(codeAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserFindPassword)