import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction  from '../../actions/user/userAction';
import _ from 'lodash';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    header_view:{
        backgroundColor:'#D34D3D',
        height:140
    },
    header_content:{
        margin:10, flex: 2, flexDirection: 'row',
    },
    header_background:{
        position:'absolute',
        height:140,
        width:'100%',
        resizeMode:'cover'
    },
    user_img_view:{ flex: 2,alignItems:'center',justifyContent:'center'},
    user_text_view:{ 
        flex: 7,
        justifyContent:'center',marginLeft:10
    },
    user_set_view:{ flex:1,},
    user_img:{
        width:65,height:65,borderRadius:33,margin:5,
    },
    user_name:{
        fontSize:setFontSize(18),color:'white',
        backgroundColor:'transparent'
    },
    dynamic_follow_fans:{
        flex: 1, 
        flexDirection: 'row',
        borderTopColor:'#F6F6F6',
        borderTopWidth:1,
        padding:5,
        backgroundColor:'transparent'
    },
    dynamic:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent'
    },
    follow:{
        flex:1,alignItems:'center',
        justifyContent:'center' ,
        backgroundColor:'transparent'
    },
    fans:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent'
    },
    dynamic_text:{
        color:'white',

        backgroundColor:'transparent'
    },
    follow_text:{
        color:'white',
        backgroundColor:'transparent'
    },
    fans_text:{
        color:'white',
        backgroundColor:'transparent'
    },
    user_dynamic_number:{ 
        color:'white',
        backgroundColor:'transparent'
    },
    user_follow_number:{
        color:'white',
        backgroundColor:'transparent'
    },
    user_fans_number:{ color:'white'},
        setting:{
        fontSize:setFontSize(25),
        color:'white',
        marginTop:10,
        backgroundColor:'transparent'
    },
    header_autograph:{
       paddingTop:10
    },
    autograph_text:{
        color:'white',
        backgroundColor:'transparent'
    },
});

class UserHeader extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
        };
        this.loginClick = this.loginClick.bind(this)
    }

    componentDidMount() {
        this.props.login && this.props.userAction.getUser(this.props.login)
    }

    componentWillReceiveProps(nextProps) {
        !this.props.login && nextProps.login && this.props.userAction.getUser(nextProps.login)
    }
    loginClick (){
        if (this.props.userdata && this.props.login){
            
        }else{
            this.props.loginClick()
        }
    }
    render() {
        let userName = this.props.userdata && this.props.userdata.hasOwnProperty('alias')?this.props.userdata.alias:'用户登录'  // _.result(this.props,'userdata.alias','用户登录') || ''
        let userSign = this.props.userdata && this.props.userdata.hasOwnProperty('introduce')&&this.props.userdata.introduce?this.props.userdata.introduce:'有态度，有意思'  //_.result(this.props,'userdata.introduce','有态度，有意思') || '有态度，有意思' //
        let forum_count = this.props.userdata && this.props.userdata.hasOwnProperty('forum_count')?this.props.userdata.forum_count:0  // _.result(this.props,'userdata.forum_count',0) 
        let fans_count = this.props.userdata && this.props.userdata.hasOwnProperty('fans_count')?this.props.userdata.fans_count:0  //_.result(this.props,'userdata.fans_count',0)
        let follow_count = this.props.userdata && this.props.userdata.hasOwnProperty('follow_count')?this.props.userdata.follow_count:0 //_.result(this.props,'userdata.follow_count',0) 
        let avatar = this.props.userdata && this.props.userdata.hasOwnProperty('avatar')&&this.props.userdata.avatar&&this.props.userdata.avatar!=''?{uri:this.props.userdata.avatar}:Images.defaultAvatar; // _.result(this.props,'userdata.avatar',null)||null?{uri:this.props.userdata.avatar}:Images.defaultAvatar;
        let backgroundImage = this.props.userdata && this.props.userdata.hasOwnProperty('background_image')&&this.props.userdata.background_image&&this.props.userdata.background_image!=''?{uri:this.props.userdata.background_image}:undefined; //_.result(this.props,'userdata.background_image',null)||null?{uri:this.props.userdata.background_image}:undefined
        let statusBarStyle = this.props.tintStatusBar?{height:140+statusBarHeight,paddingTop:statusBarHeight}:{}
        return (
            <View style={[styles.header_view,statusBarStyle]}>
                {backgroundImage&&<Image source={backgroundImage} style={[styles.header_background,statusBarStyle]}/>}
                <View style={styles.header_content}>
                    <TouchableOpacity style={styles.user_img_view} onPress={this.props.onUserPagePress}>
                        <Image source={avatar} style={styles.user_img}></Image>
                    </TouchableOpacity>
                    <View style={styles.user_text_view}>
                        <TouchableOpacity  onPress={this.loginClick}><Text style={styles.user_name}>{userName}</Text></TouchableOpacity>
                        <View style={styles.header_autograph}>
                            <Text style={styles.autograph_text}>{userSign}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.props.settingClick} style={styles.user_set_view}>
                        <Icon name="cog" style={styles.setting}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.dynamic_follow_fans}>
                    <TouchableOpacity onPress={this.props.dynamicClick} style={styles.dynamic}><Text style={styles.user_dynamic_number}>{forum_count}</Text>
                        <Text style={styles.dynamic_text}>动态</Text></TouchableOpacity>
                    <TouchableOpacity  onPress={this.props.followClick} style={styles.follow}><Text style={styles.user_follow_number}>{follow_count}</Text>
                        <Text style={styles.follow_text}>关注</Text></TouchableOpacity>
                    <TouchableOpacity onPress={this.props.fansClick} style={styles.fans}><Text style={styles.user_fans_number}>{fans_count}</Text>
                        <Text style={styles.fans_text}>粉丝</Text></TouchableOpacity>
                </View>
            </View>
            );
    }
}
function mapStateToProps(state, ownProps){
    return {
        tintStatusBar:state.root.user.tintStatusBar,
        userdata: state.root.user.userdata,
        login: state.root.user.login,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserHeader);