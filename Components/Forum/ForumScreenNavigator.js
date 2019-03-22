import React,{Component} from 'react';
import {View,Text,Image,ActivityIndicator,TouchableOpacity,StyleSheet} from 'react-native';
import {TabNavigator,TabBarTop} from 'react-navigation';
import ForumScreen from "./ForumComponent";
import ForumList from './ForumList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as forumAction from '../../actions/forum/forumAction';
import SubHeader from '../Mould/SubHeader';
import _ from 'lodash';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
  container:{width:'100%',height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'},
  loadingBackground:{width:100,height:100,backgroundColor:'#0008',justifyContent:'center',alignItems:'center',borderRadius:10}
})

class ForumScreenNavigatorContainer extends Component{
  static navigationOptions = ({ navigation , screenProps}) => {
    return {
        header:<SubHeader navigation={navigation} title='有料论坛' headerLeft={null}/>,
        tabBarIcon: ({focused}) => (
          focused?
              <Image source={Images.forumActive} style={{width:25,height:25}}/>:
              <Image source={Images.forumInactive} style={{width:25,height:25}}/>
        )
    }
  };
  constructor(props){
    super(props)
    this.state = {
      timeout:false
    }
  }
  componentDidMount() {
    this.reloadCategory()
  }
  reloadCategory = ()=>{
    if (this.props.category.length) return;
    this.setState({timeout:false})
    this.props.forumAction.initCategory()
    this.timer = setTimeout(() => {
      if (!this.props.category.length){
        this.setState({timeout:true})
      }
      clearTimeout(this.timer)
    }, 10000);
  }
  renderTopTabs = ()=>{
    var routeConfigMap = {}
    if (this.props.category.length){
      routeConfigMap = {}
      for (let i=0; i<this.props.category.length; i++){
        let category = this.props.category[i]
        routeConfigMap[category.category_name] = {
          screen: ForumList,
          navigationOptions: ({navigation}) => ({
            title: category.category_name,
            
          }),
        }
      }
    }else if(this.state.timeout){
      return (
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={this.reloadCategory}>
          <Text>重新加载</Text>
        </TouchableOpacity>
      )
    }else{
      return (
        <View style={styles.container}>
          <View style={styles.loadingBackground}>
            <ActivityIndicator size='large' style={{alignSelf:'center'}}></ActivityIndicator>
          </View>
        </View>
      )
    }
    let initialRouteName = _.result(this.props,'navigation.state.params.category_name',this.props.category[0].name)
    let drawConfig = {
      tabBarComponent:TabBarTop,
      swipeEnabled: false,
      lazyLoad: true,
      lazy:true,
      animationEnabled: false,
      tabBarPosition: 'top',
      initialRouteName,
      tabBarOptions: {
        scrollEnabled:true,
        activeTintColor: '#D34D3D',
        inactiveTintColor: 'black',
        indicatorStyle:{opacity:0},
        allowFontScaling:false,
        labelStyle: {
          fontSize:setFontSize(15),
          margin:0,
          padding:0
        },
        tabStyle:{
            width:60,
            height:35,
            margin:0,
            padding:0,
        },
        style: {
          margin:0,
          padding:0,
          backgroundColor: '#fcfcfc',
        },
      }
    };
    let Tabs = TabNavigator(routeConfigMap, drawConfig)
    return <Tabs screenProps={{navigation:this.props.navigation}}/>;
  }
  render(){
    return (
      <View style={{flex:1,backgroundColor:'black',width:'100%',height:'100%'}}>
        {this.renderTopTabs()}
      </View>
    )
  }
}
function mapStateToProps(state, ownProps){
  return {
    category:state.root.forum.category
  };
}
function mapDispatchToProps(dispatch){
  return {
    forumAction:bindActionCreators(forumAction,dispatch),
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(ForumScreenNavigatorContainer);