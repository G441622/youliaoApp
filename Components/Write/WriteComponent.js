import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity ,Keyboard, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WriteArticle from "./WriteArticle";
import WriteLocation from './WriteLocation';
import {connect} from 'react-redux';
import { store } from '../../App';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    userview:{
        flex: 1,
        justifyContent: 'flex-start',
    }

  });
class WriteScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        
        return {
            tabBarIcon: ({focused}) => (
                focused ?
                    <Image source={Images.tianjiaActive} style={{width: 28, height: 28}}/> :
                    <Image source={Images.tianjiaInactive} style={{width: 28, height: 28}}/>
            ),
            tabBarVisible: false,
            tabBarOnPress:({previousScene,scene, jumpToIndex})=>{
                let state = store.getState()
                if (state.root.user.login){
                    navigation.navigate('WriteArticle')
                }else{
                    navigation.navigate('UserLogin')
                }
            }
        }
    };
    render() {
      return (
        <View style={styles.userview}>
        </View>
      );
    }
  }

  export default connect()(WriteScreen);