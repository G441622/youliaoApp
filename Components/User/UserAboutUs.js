import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../Mould/SubHeader';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAboutUsAction from '../../actions/user/userAboutUsAction';
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

class UserAboutUs extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'关于我们'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
    }
    componentDidMount() {
        this.props.userAboutUsAction.getAboutUs();
    }
    render() {
        var content = this.props.userabout && this.props.userabout.content?this.props.userabout.content.map((x,i)=>{
            return<View key={i}><Text>{x.text}</Text></View>
        }):<View></View>;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.textView}>
                    {content}
                </View>
            </ScrollView>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        userabout: state.root.user.userabout,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAboutUsAction: bindActionCreators(userAboutUsAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserAboutUs);