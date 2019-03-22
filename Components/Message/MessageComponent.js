import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../Mould/SubHeader';
import MessageHomeScreen from './MessageHomeScreen';
import * as messageNoticeAction from '../../actions/message/messageNoticeAction';
import * as newsReplyAction from '../../actions/message/newsReplyAction';
import { store } from "../../App";
import * as commonAction from '../../actions/common/commonAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    userview:{
        flex: 1,
        justifyContent: 'flex-start',
    }
});
class MessageScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader navigation={navigation} title='互动中心' hideHeaderLeft={true}/>,
            // By default the icon is only shown on iOS. Search the showIcon option below.
            tabBarIcon: ({focused}) => (
                focused?
                    <Image source={Images.hudongActive} style={{width:30,height:30}}/>:
                    <Image source={Images.hudongInactive} style={{width:30,height:30}}/>
            ),
            tabBarOnPress:({previousScene,scene, jumpToIndex})=>{//{route,index},jumpToIndex
                jumpToIndex(scene.index)
                if (store.getState().root.user.login){
                    store.dispatch(messageNoticeAction.getNoticeNumber())
                    store.dispatch(newsReplyAction.getReplyNumber())
                }
            }
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            show:false,
        };
        this.onCommentPress = this.onCommentPress.bind(this);
        this.onCollectionPress = this.onCollectionPress.bind(this);
        this.onReplyPress = this.onReplyPress.bind(this);
        this.onNoticePress = this.onNoticePress.bind(this);
        this.onContactusPress = this.onContactusPress.bind(this);
        this.onBulletinPress = this.onBulletinPress.bind(this);
    }
    onCommentPress(){
        this.props.login ? this.props.navigation.navigate('NewsComment',{}) : this.props.commonAction.showTip('未登录');;
    }
    onCollectionPress(){
        this.props.login ? this.props.navigation.navigate('NewsCollection',{}) : this.props.commonAction.showTip('未登录');;
    }
    onReplyPress(){
        this.props.login ? this.props.navigation.navigate('NewsReply',{}) : this.props.commonAction.showTip('未登录');;
    }
    onNoticePress(){
        this.props.login ? this.props.navigation.navigate('MessageNotice',{}) : this.props.commonAction.showTip('未登录');;
    }
    onContactusPress(){
        this.props.navigation.navigate('MessageContactus',{});
    }
    onBulletinPress(){
        this.props.navigation.navigate('MessageBulletin',{});
    }
    render() {
        return (<View style={styles.userview}>
            <MessageHomeScreen
            onCommentPress={this.onCommentPress}
            onCollectionPress={this.onCollectionPress}
            onReplyPress={this.onReplyPress}
            onNoticePress={this.onNoticePress}
            onContactusPress={this.onContactusPress}
            onBulletinPress={this.onBulletinPress}/></View>);
    }
}

function mapStateToProps(state, ownProps){
return {
    login: state.root.user.login,
};
}
function mapDispatchToProps(dispatch){
    return {
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(MessageScreen);