import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image ,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ForumScreenNavigator from './ForumScreenNavigator';
import Images from '../../imagesRequired';
const styles = StyleSheet.create({
    newsview:{
        flex: 1,
        justifyContent: 'flex-start',
        //paddingTop: 20,
        //backgroundColor: '#F7F7F7'
    }
  });
class ForumScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            tabBarIcon: ({focused}) => (
                focused?
                    <Image source={Images.forumActive} style={{width:23,height:23}}/>:
                    <Image source={Images.forumInactive} style={{width:23,height:23}}/>
            )
        }
    };
    render() {
      return <View style={styles.newsview}>
          <ForumScreenNavigator navigation={this.props.navigation}/>
      </View>
    }
  }

  export default ForumScreen;