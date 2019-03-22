import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: 'white',
    },
    container:{
        backgroundColor: '#D43D3D',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        flexDirection:'row',
    },
    header:{
        color: 'white',
        fontSize:setFontSize(20),
    },
    search_icon:{
        color: 'white',
        fontSize:setFontSize(20),
        position:'absolute',
        right:10
    },
});
class MessageHeader extends React.Component {
    render(){
        return (<View style={styles.MainContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>互动中心</Text>
            </View>
        </View>);
    }
}

export default MessageHeader;