import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserHeader from './UserHeader';
import * as userAction  from '../../actions/user/userAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Article,ListTitle} from '../CustomComponents/CustomText';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    list:{
        /*marginTop:10,*/
    },
    list_view:{
        marginBottom:1,
        backgroundColor:'white',
        flexDirection:'row'
    },
    text_title:{
        color:'#585858',
        fontSize:setFontSize(17),
        padding:15,
    },
    text:{
        fontSize:setFontSize(17),
        padding:15,
        color:'#d34d3d',
        position:'absolute',
        right:0
    },
});

class UserFont extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'字号设置'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            show:false,
        };
        this.onEmailPress = this.onEmailPress.bind(this);
    }
    onEmailPress() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }
    render() {
        return (
            <View style={styles.list}>
                <TouchableOpacity style={styles.list_view} onPress={()=>this.props.userAction.setFontSize('large')}>
                    <ListTitle style={styles.text_title}>大</ListTitle>
                    {this.props.fontSize == 'large' && <Text style={styles.text}><Icon name="check" style={styles.text}/></Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.list_view} onPress={()=>this.props.userAction.setFontSize('middle')}>
                    <ListTitle style={styles.text_title}>中</ListTitle>
                    {this.props.fontSize == 'middle' && <Text style={styles.text}><Icon name="check" style={styles.text}/></Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.list_view} onPress={()=>this.props.userAction.setFontSize('small')}>
                    <ListTitle style={styles.text_title}>小</ListTitle>
                    {this.props.fontSize == 'small' && <Text style={styles.text}><Icon name="check" style={styles.text}/></Text>}
                </TouchableOpacity>
            </View>
        );
    }
}

function mapStateToProps(state, ownProps){
    return {
        fontSize: state.root.user.fontSize,
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction, dispatch)
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(UserFont);