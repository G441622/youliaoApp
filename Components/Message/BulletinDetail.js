import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import SubHeader from '../Mould/SubHeader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageBulletinAction from '../../actions/message/messageBulletinAction';
const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10

    },
    content:{
        justifyContent:'center',
        alignItems:'center'
    },
    title:{
        fontSize:setFontSize(20),
    },
    Source:{
        marginTop:10,
        flexDirection:'row'
    },
    textView:{
        marginTop:10,
    },
});
class BulletinDetail extends React.Component{
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'公告详情'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    componentDidMount() {
        this.props.messageBulletinAction.getBulletinDetail({id:this.props.navigation.state.params.Bulletin.article_id});
    }
    render(){
        var bulletin = this.props.navigation.state.params.Bulletin;
        var content = this.props.bulletindetail && this.props.bulletindetail.content?this.props.bulletindetail.content.map((x,i)=>{
                return<View key={i}><Text>{x.text}</Text></View>
        }):<View></View>;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{bulletin.title}</Text>
                    <View style={styles.Source}>
                        <Text>{bulletin.author}</Text>
                        <Text>   {bulletin.add_time}</Text>
                    </View>
                </View>
                <View style={styles.textView}>
                    {content}
                </View>
            </ScrollView>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        bulletindetail: state.root.message.bulletindetail,
    };
}
function mapDispatchToProps(dispatch){
    return {
        messageBulletinAction: bindActionCreators(messageBulletinAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(BulletinDetail);