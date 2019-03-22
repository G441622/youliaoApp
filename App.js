import React from 'react';
import { StyleSheet, Text, View, Dimensions,TextInput,ScrollView ,Image ,BackHandler} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  NavigationActions,
  addNavigationHelpers
} from 'react-navigation';
import {combineReducers,createStore, applyMiddleware, compose} from 'redux';  
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {connect,Provider} from 'react-redux';  
import MainNavigator,{MainStackNavigator} from './Components/MainNavigator';
import rootReducer from './reducers/rootReducer';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import devToolsEnhancer from 'remote-redux-devtools';
import initialState from './reducers/initialState';
import UmengPush from 'react-native-umeng-push';
import SplashScreen from 'react-native-splash-screen'
import codePush from "react-native-code-push";
import "./setting";

// const screenHeight = Dimensions.get('window').height;
// const screenWidth = Dimensions.get('window').width;

// if (!__DEV__){
//   global.console = {
//     log:()=>{},
//     warn:()=>{},
//   }
// }

// global.screenHeight = screenHeight;
// global.screenWidth = screenWidth;

const navReducer = (state = initialState.nav, action) => {
  switch (action.type) {
    case 'nav':{
      return Object.assign({},state,{...action.data})
    }
    default:return state
  }
};

const appReducer = combineReducers({
  nav: navReducer,
  root: rootReducer
  //...
});

class App extends React.Component {
  constructor(props){
    super(props)
    // this.navigation = addNavigationHelpers({
    //   dispatch: this.props.dispatch,
    //   state: this.props.nav,
    // })
  }
  // componentDidMount() {
  //   BackHandler.addEventListener("hardwareBackPress", this.onBackPress);      
  // }
  // componentWillUnmount() {
  //   BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  // }
  // onBackPress = () => {
  //   const { nav } = this.props;
  //   const { dispatch } = this.navigation;
  //   console.log(nav,dispatch)
  //   if (nav.index === 0) {
  //     return false;
  //   }
  //   this.navigation.goBack();
  //   return true;
  // };
  render() {
    let navigation = addNavigationHelpers({
      dispatch: this.props.dispatch,
      state: this.props.nav,
    })
    return (
      <MainNavigator navigation={navigation}/>
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = createStore(
  appReducer, 
  initialState,
  composeWithDevTools(
    applyMiddleware(thunk,reduxImmutableStateInvariant())), 
    window.devToolsExtension ? window.devToolsExtension() : f => f,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


class Root extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
  }
  
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

//获取DeviceToken
UmengPush.getDeviceToken(deviceToken => {
  console.log("deviceToken: ", deviceToken);
});
//接收到推送消息回调
UmengPush.didReceiveMessage(message => {
  console.log("didReceiveMessage:", message);
});

//点击推送消息打开应用回调
UmengPush.didOpenMessage(message => {
  console.log("didOpenMessage:", message);
});
export default codePush(Root);
export {store};