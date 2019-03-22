import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image} from 'react-native';
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
    },
    header:{
        color: 'white',
        fontSize:setFontSize(20),
    }
});
class ForumHeader extends React.Component{
    constructor(props, context){
        super(props, context);
    }
    render(){
        return (<View style={styles.MainContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>有料论坛</Text>
            </View>
        </View>);
    }
}

export default ForumHeader;