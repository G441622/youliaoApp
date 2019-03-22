import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image} from 'react-native';;
import Icon from 'react-native-vector-icons/FontAwesome';
import Images from '../../imagesRequired';
import NewsScreenNavigator from './NewsScreenNavigator';


const styles = StyleSheet.create({
    newsview:{
        flex: 1,
        justifyContent: 'flex-start',
        //paddingTop: 20,
        //backgroundColor: '#F7F7F7'
    }
  });

  class NewsScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
      return {
        tabBarIcon: ({focused}) => (
            focused?
                <Image source={Images.homeActive} style={{width:25,height:25}}/>:
                <Image source={Images.homeInactive} style={{width:25,height:25}}/>
        ),
      }
    };
    render() {
      return (
        <View style={styles.newsview}>
          <NewsScreenNavigator navigation={this.props.navigation}/>
        </View>
      )
    }
  }

  export default NewsScreen;
