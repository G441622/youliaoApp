import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHomeScreen from './UserHomeScreen';
import UserLogin from './UserLogin';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction  from '../../actions/user/userAction';
import * as commonAction from '../../actions/common/commonAction';
import { store } from '../../App';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    userview:{
        flex: 1,
    }
});

class UserScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:null,
            tabBarIcon: ({focused}) => (
                focused?
                    <Image source={Images.yonghuActive} style={{width:23,height:23}}/>:
                    <Image source={Images.yonghuInactive} style={{width:23,height:23}}/>
            ),
            tabBarOnPress:({previousScene,scene, jumpToIndex})=>{
                jumpToIndex(scene.index)
                let state = store.getState();
                let login = state.root.user.login;
                if (login){
                    
                    store.dispatch(userAction.getUser(login))
                }
                // else{
                //     navigation.navigate('UserLogin')
                // }
            }
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            show:false,
        };
        this.onUserPagePress = this.onUserPagePress.bind(this);
        this.onBindingPress = this.onBindingPress.bind(this);
        this.onPasswordPress = this.onPasswordPress.bind(this);
        this.onFontPress = this.onFontPress.bind(this);
        this.onSharePress = this.onSharePress.bind(this);
        this.onDraftsPress = this.onDraftsPress.bind(this);
        this.onAboutPress = this.onAboutPress.bind(this);
        this.onDynamicPress = this.onDynamicPress.bind(this);
        this.onLoginPress = this.onLoginPress.bind(this);
        this.onFansPress = this.onFansPress.bind(this);
        this.onFollowPress = this.onFollowPress.bind(this);
        this.onSettingPress = this.onSettingPress.bind(this);
        this.onCachePress = this.onCachePress.bind(this);
        this.onSearchPress = this.onSearchPress.bind(this);
    }
    onUserPagePress(){
        this.props.login ? this.props.navigation.navigate('UserCenter',{userfollow: this.props.userdata}) : this.props.commonAction.showTip('未登录');
    }
    onBindingPress(){
        this.props.login ? this.props.navigation.navigate('UserBinding',{}) : this.props.commonAction.showTip('未登录');
    }
    onPasswordPress(phone){
        this.props.login ? this.props.navigation.navigate('UserFindPassword',{phone}) : this.props.commonAction.showTip('未登录');
    }
    onFontPress(){
        this.props.navigation.navigate('UserFont',{});
    }
    onSharePress(){
        this.props.login ? this.props.navigation.navigate('UserShare',{}) : this.props.commonAction.showTip('未登录');
    }
    onDraftsPress(){
        this.props.login ? this.props.navigation.navigate('UserDrafts',{}) : this.props.commonAction.showTip('未登录');
    }
    onAboutPress(){
        this.props.navigation.navigate('UserAbout',{});
    }
    onDynamicPress(){
        this.props.login ? this.props.navigation.navigate('UserDynamic',{}) : this.props.commonAction.showTip('未登录');
    }
    onLoginPress(){
        this.props.navigation.navigate('UserLogin',{});
    }
    onFollowPress(){
        this.props.login ? this.props.navigation.navigate('UserFollow',{user_id:this.props.userdata.user_id}) : this.props.commonAction.showTip('未登录');
    }
    onFansPress(){
        let {user_id} = this.props.userdata
        this.props.login ? this.props.navigation.navigate('UserFans',{user_id}) : this.props.commonAction.showTip('未登录');
    }
    onSettingPress(){
        this.props.login ? this.props.navigation.navigate('UserSetting',{}) : this.props.commonAction.showTip('未登录');
    }
    onSearchPress(){
        this.props.login ? this.props.navigation.navigate('NewsSearch',{}) : this.props.commonAction.showTip('未登录');
    }

    onCachePress() {
        this.setState({show:!this.state.show});
    }
    render() {
        return (
            <View style={styles.userview}>
                {this.props.login?
                <UserHomeScreen
                onUserPagePress={this.onUserPagePress}
                onSearchPress={this.onSearchPress}
                dynamicClick={this.onDynamicPress}
                loginClick={this.onLoginPress}
                fansClick={this.onFansPress}
                followClick={this.onFollowPress}
                settingClick={this.onSettingPress}
                onBindingPress={this.onBindingPress}
                onPasswordPress={this.onPasswordPress}
                onFontPress={this.onFontPress}
                onSharePress={this.onSharePress}
                onAboutPress={this.onAboutPress}
                onDraftsPress={this.onDraftsPress}/>
                :<UserLogin navigation={this.props.navigation}/>}
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        userdata: state.root.user.userdata,
        login: state.root.user.login,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserScreen);