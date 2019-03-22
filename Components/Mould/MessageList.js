import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
    userContainer:{
        backgroundColor: 'white',
        flexDirection:'row',
        paddingBottom:10,
        paddingTop:10,
        marginBottom:1
    },
    user_img:{
        width:50,
        height:50,
        borderRadius:8,
        marginRight:10,
    },
    content_view:{
        justifyContent: 'center',
    },
    name_view:{
        flexDirection:'row',
    },
    name_text:{
        color:'#585858',
        fontSize:setFontSize(15),

    },
    name_text_action:{
        marginLeft:10,
        color:'#ccc'

    },
    chat_text:{
        marginTop:10

    },
    time_view:{
        alignItems: 'center',
        position:'absolute',
        right:0,
        paddingTop:10,

    },
});
class MessageList extends React.Component{
    render(){
        let{title,author,add_time,img}=this.props.Data;
        return (
            <TouchableOpacity style={styles.userContainer} onPress={this.props.onPress}>
                <View style={styles.img_view}>
                    <Image source={{uri:img}} style={styles.user_img}></Image>
                </View>
                <View style={styles.content_view}>
                    <View style={styles.name_view}>
                        <Text style={styles.name_text}>{title}</Text>
                        <Text style={styles.name_text_action}></Text>
                    </View>
                    <Text style={styles.chat_text}numberOfLines={1}>{author}</Text>
                </View>
                <View style={styles.time_view}>
                    <Text>{add_time}</Text>
                </View>
            </TouchableOpacity>);
    }
}

export default MessageList;