import React from 'react';
import { StyleSheet, Text, View,TextInput,ScrollView ,Image, Platform, ActivityIndicator, TouchableOpacity} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  addNavigationHelpers,
  TabBarBottom
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {combineReducers,createStore, applyMiddleware} from 'redux';  
import {connect,Provider} from 'react-redux';  
import {bindActionCreators} from 'redux';
import * as newsAction  from '../actions/news/newsAction';
import * as userAction  from '../actions/user/userAction';
import * as forumAction from '../actions/forum/forumAction';
import * as commonAction from '../actions/common/commonAction';

import UserScreen from './User/UserComponent';
import WriteScreen from './Write/WriteComponent';
import MessageScreen from './Message/MessageComponent';
import ForumScreenNavigator from './Forum/ForumScreenNavigator';
import NewsScreenNavigator from './News/NewsScreenNavigator';
//news
import NewsList from './News/NewsList';
import NewsDetailScreen from './News/NewsDetailScreen';
import NewsSearch from './News/NewsSearch';
import NewsUserReply from './News/NewsUserReply';
//forum
import ForumDetailScreen from './Forum/ForumDetailScreen';
import ForumUserReply from './Forum/ForumUserReply';
//user
import UserReport from './User/UserReport';
import UserSettingScreen from  './User/UserSettingScreen';
import UserBindingScreen from './User/UserBindingScreen';
import UserShare from './User/UserShare';
import UserGift from './User/UserGift';
import UserAboutScreen from './User/UserAboutScreen';
import UserAboutUs from './User/UserAboutUs';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import UserFindPassword from './User/UserFindPassword';
import UserFans from './User/UserFans';
import UserFollow from './User/UserFollow';
import UserDynamic from './User/UserDynamicScreen';
import UserCenter from './User/UserCenter';
import UserFont from './User/UserFont';
import UserDrafts from './User/UserDrafts';
//message
import NewsComment from './Message/NewsComment';
import NewsCollection from './Message/NewsCollection';
import NewsReply from './Message/NewsReply';
import MessageNotice from './Message/MessageNotice';
import MessageBulletin from './Message/MessageBulletin';
import MessageContactus from './Message/MessageContactus';
import BulletinDetail from './Message/BulletinDetail';
//write
import WriteArticle from './Write/WriteArticle';
import WriteVote from './Write/WriteVote';
import WriteLocation from './Write/WriteLocation';

console.disableYellowBox = true

const styles = StyleSheet.create({
  newsview:{
      flex: 1,
      justifyContent: 'flex-start',
      //backgroundColor: '#F7F7F7'
  }
});

const MainScreenNavigator = TabNavigator({
  主页: { screen: NewsScreenNavigator },
  消息: { screen: MessageScreen },
  发表: { screen: WriteScreen },
  论坛: { screen: ForumScreenNavigator },
  用户: { screen: UserScreen }
}, {
  lazy:true,
  tabBarComponent:TabBarBottom,
  tabBarPosition: 'bottom',
  // animationEnabled:true,//for header back button,it must now
  swipeEnabled:false,
  tabBarOptions: {
    showLabel : false,
    showIcon: true,
    activeTintColor:'#D34D3D',
    inactiveTintColor: 'black',
    labelStyle: {
      fontSize:setFontSize(18),
      marginBottom: 15,
    },
    tabStyle:{
      height:44
    },
    style: {
      // flex:1,
      backgroundColor: '#fbfbfb',
      // marginBottom:bottomHeight
    },
  }
});

// let transition = false;

const MainStackNavigator = StackNavigator({
    MainScreen: {screen: MainScreenNavigator},
    //news
    NewsList: {screen:NewsList},
    NewsDetail: {screen: NewsDetailScreen},
    NewsSearch: {screen: NewsSearch},
    NewsUserReply: {screen: NewsUserReply},
    //forum
    ForumDetailScreen: {screen: ForumDetailScreen},
    ForumUserReply: {screen: ForumUserReply},
    //user
    UserReport: {screen: UserReport},
    UserSetting: { screen: UserSettingScreen },
    UserBinding: {screen: UserBindingScreen},
    UserShare:{screen: UserShare},
    UserGift:{screen: UserGift},
    UserAbout:{screen:UserAboutScreen},
    UserAboutUs:{screen:UserAboutUs},
    UserRegister:{screen:UserRegister},
    UserLogin:{screen:UserLogin},
    UserFindPassword:{screen:UserFindPassword},
    UserFans:{screen:UserFans},
    UserFollow:{screen:UserFollow},
    UserDynamic:{screen:UserDynamic},
    UserCenter:{screen:UserCenter},
    UserFont:{screen:UserFont},
    UserDrafts:{screen:UserDrafts},
    //messages
    NewsComment: {screen:  NewsComment},
    NewsCollection: {screen:  NewsCollection},
    NewsReply: {screen:  NewsReply},
    MessageNotice: {screen:  MessageNotice},
    MessageContactus: {screen:  MessageContactus},
    MessageBulletin: {screen:  MessageBulletin},
    BulletinDetail: {screen:  BulletinDetail},

    //Write
    WriteArticle: {screen:  WriteArticle},
    WriteVote: {screen:  WriteVote},
    WriteLocation : {screen: WriteLocation}
},{
  headerMode:Platform.OS=='ios'?'float':'screen',
  // onTransitionStart=()=>{},
  // onTransitionEnd=()=>{}
});


//export default MainScreenNavigator;
class MainNavigator extends React.Component {
    constructor(props, context){
      super(props, context);
      this.renderLoading = this.renderLoading.bind(this)
      this.renderTip = this.renderTip.bind(this)
    }
    componentDidMount() {
      this.props.userAction.isLogin()
      this.props.newsAction.initCategory()
      this.props.forumAction.initCategory()
    }
    componentWillReceiveProps = (nextProps) => {

    }
    renderLoading(){
      return (
        <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'#0000',justifyContent:'center',alignItems:'center'}} pointerEvents='box-none'>
          <TouchableOpacity style={{width:100,height:100,backgroundColor:'#0008',justifyContent:'center',alignItems:'center',borderRadius:10}} onPress={()=>this.props.commonAction.hideLoading()}>
            <ActivityIndicator size='large' style={{alignSelf:'center'}}></ActivityIndicator>
          </TouchableOpacity>
        </View>
      )
    }
    renderTip(){
      return (
        <View style={{position:'absolute',top:'70%',width:'100%',height:'30%',backgroundColor:'#0000',justifyContent:'center',alignItems:'center'}} pointerEvents='box-none'>
          <View style={{minWidth:'60%',height:44,backgroundColor:'#0008',justifyContent:'center',alignItems:'center',borderRadius:10,paddingHorizontal:20}} >
            <Text style={{color:'white'}}>{this.props.tip}</Text>
          </View>
        </View>
      )
    }
    render() {
      return (
        <View  style={styles.newsview}>
          {!this.props.tintStatusBar&&<View style={{height:statusBarHeight}}></View>}
          <MainStackNavigator 
            myNavigation={this.props.navigation} 
            onNavigationStateChange={(prevState, currentState)=>{
              // console.log({prevState,currentState})
              try {
                let routes = currentState.routes;
                let currentPage = routes[routes.length-1]
                let routeName = currentPage.routeName
                let routekey = currentPage.key
                // console.log(`RouteName : ${routeName}  key : ${routekey}`)
                let data = {routeName,key:routekey}
                // console.log(currentPage,currentState)
                this.props.navigation.dispatch({type:'nav',data:{...currentState,...currentPage}})
              } catch (error) {
                // console.log('onNavigationStateChange catched : ',error)
              }
            }}
          />
          {this.props.loading && this.renderLoading()}
          {this.props.tip && this.renderTip()}
        </View>
      )
    }
  }
  function mapStateToProps(state, ownProps){
    return {
        tintStatusBar:state.root.user.tintStatusBar,
        myNavigation: state.root.navigation,
        nav:state.nav,
        loading:state.root.common.loading,
        tip:state.root.common.tip
    };
}
function mapDispatchToProps(dispatch){
    return {
        newsAction: bindActionCreators(newsAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        forumAction:bindActionCreators(forumAction,dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MainNavigator);
