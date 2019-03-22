import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
        content:{
            flex:1,
            backgroundColor:'white'
        },

    }
);

class UserGift extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'奖励明细'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
    }

    render() {
        return (<ScrollView style={styles.content}>
            <Text>lipin</Text>

        </ScrollView>);
    }
}

export default UserGift;