import React,{Component} from 'react';
import { Text , Image , View , TouchableOpacity , ActivityIndicator, StyleSheet} from 'react-native';
import { TabNavigator,TabBarTop } from 'react-navigation';
import {connect} from 'react-redux';
import NewsList from './NewsList';
import SubHeader from '../Mould/SubHeader';
import {bindActionCreators} from 'redux';
import * as newsAction  from '../../actions/news/newsAction';
import _ from 'lodash';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
  container:{width:'100%',height:'100%',backgroundColor:'white',justifyContent:'center',alignItems:'center'},
  loadingBackground:{width:100,height:100,backgroundColor:'#0008',justifyContent:'center',alignItems:'center',borderRadius:10}
})

class NewsScreenNavigatorContainer extends Component{
  static navigationOptions = ({ navigation , screenProps}) => {
    return {
      header:<SubHeader navigation={navigation} title='有料新闻' headerLeft={null} headerRight={<TouchableOpacity style={{marginRight:10}} onPress={()=>navigation.navigate('NewsSearch',{})}><Image source={Images.search} style={{width:20,height:20}}/></TouchableOpacity>}/>,
      tabBarIcon: ({focused}) => (
        focused?
        <Image source={Images.homeActive} style={{width:25,height:25}}/>:
        <Image source={Images.homeInactive} style={{width:25,height:25}}/>
      ),
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
    this.props.newsAction.initCategory()
    this.setState({timeout:false})
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
      for (let i=0; i<this.props.category.length; i++){
        let category = this.props.category[i]
        routeConfigMap[category.name] = {
          screen: NewsList
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
      title:'新闻',
      // mode: 'modal',
      tabBarOptions: {
        scrollEnabled:true,
        activeTintColor: '#D34D3D',
        inactiveTintColor: 'black',
        allowFontScaling:false,
        indicatorStyle:{opacity:0},
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
          padding:0,
          margin:0,
          backgroundColor: '#fcfcfc',
        },
      }
    };
    Tabs = TabNavigator(routeConfigMap, drawConfig);
    return <Tabs screenProps={{navigation:this.props.navigation}}/>
  }
  render(){
    return (
      <View style={{flex:1}}>
        {this.renderTopTabs()}
      </View>
    )
  }
}
function mapStateToProps(state, ownProps){
  return {
    category:state.root.news.category
  };
}
function mapDispatchToProps(dispatch){
  return {
    newsAction: bindActionCreators(newsAction, dispatch)
  };
}

export default connect(mapStateToProps,mapDispatchToProps)(NewsScreenNavigatorContainer);