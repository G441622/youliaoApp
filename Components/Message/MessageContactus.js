import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal} from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    addNavigationHelpers
} from 'react-navigation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as messageContactusAction from '../../actions/message/messageContactusAction';
import * as commonAction  from '../../actions/common/commonAction';
import SubHeader from '../Mould/SubHeader';
const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'#f9f9f9'
    },
    promptview:{
        padding:20,
        paddingBottom:0
    },
    prompt:{
        fontSize:setFontSize(14),
    },
    input:{
        backgroundColor:'white',
        marginTop:10,
    },
    input_textput:{
        padding:5,
        paddingLeft:20,
        paddingRight:20,
    },
    bottom:{
        padding:20,
        marginTop:10,
    },
    button:{
        borderRadius:2,
        backgroundColor:'#d34d3d',
        alignItems:'center'
    },
    buttontext:{
        fontSize:setFontSize(17),
        color:'white',
        textAlign:'center',
        padding:5,
    },
    promptcolor:{
        color:'#d34d3d'
    },
    write_content:{
        flex:5,
        marginTop:10,
        padding:20,
        backgroundColor:'white'
    },
    write_textput:{
        padding:0,
        height:200,
        textAlignVertical:'top',
    },

});


class MessageContactus extends React.Component {
    static navigationOptions = ({navigation})=>{
        return {
            header:<SubHeader
                title={'联系我们'}
                onPress={()=>{navigation.goBack()}}/>
        }
    };
    constructor (props) {
        super(props)
        this.state = {
            contactus:{
                mode:null,
                content:null,
            },
        };
        this.onmodeChangeText = this.onmodeChangeText.bind(this);
        this.oncontentChangeText = this.oncontentChangeText.bind(this);
        this.onsubmitPress = this.onsubmitPress.bind(this)
    }
    onmodeChangeText(text){
        var state = Object.assign({},this.state,{
            contactus:{
                mode: text,
                content: this.state.contactus.content
            }
        });
        this.setState(state);
    }
    oncontentChangeText(text){
        var state = Object.assign({},this.state,{
            contactus:{
                mode: this.state.contactus.mode,
                content: text
            }
        });
        this.setState(state);
    }
    onsubmitPress(){
        let phone = this.state.contactus.mode;
        if (!phone || phone.length != 11) return this.props.commonAction.showTip('请输入正确的手机号',5000)
        if (phone.search(/^0{0,1}(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/)==-1) return this.props.commonAction.showTip('请输入正确的手机号',5000)
        if(this.state.contactus.mode!=null&&this.state.contactus.content!=null){
           this.props.messageContactusAction.getMessageContactUs({mode:this.state.contactus.mode,content:this.state.contactus.content});
        }else{
            this.props.commonAction.showTip('请输入内容',5000)
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.contactus){
            this.props.navigation.navigate('消息',{});
        }
    }
    render() {
        return (<ScrollView style={styles.content} keyboardShouldPersistTaps='handled'>
            <View style={styles.promptview}>
                <Text style={[styles.prompt,styles.promptcolor]}>办公地址：上海市宝山区同济支路199号7号楼6层</Text>
            </View>
            <View style={styles.promptview}>
                <Text style={[styles.prompt,styles.promptcolor]}>固定电话： 021-56690791，56690773</Text>
            </View>
            <View style={styles.promptview}>
                <Text style={styles.prompt}>您也可以通过留言与我们取得联系</Text>
            </View>
            <View style={styles.input}>
                <TextInput  placeholder="请输入您的联系方式"
                            placeholderTextColor={'#ccc'}
                            style={styles.input_textput}
                            underlineColorAndroid={'transparent'}
                            value={this.state.contactus.mode}
                            onChangeText={this.onmodeChangeText}
                            ></TextInput>
            </View>
            <View style={styles.write_content}>
                <TextInput  placeholder="留言内容"
                            placeholderTextColor={'#ccc'}
                            style={styles.write_textput}
                            underlineColorAndroid="transparent"
                            value={this.state.contactus.content}
                            onChangeText={this.oncontentChangeText}
                            multiline={true}></TextInput>
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity onPress={this.onsubmitPress} style={styles.button}><Text style={styles.buttontext}>完成</Text></TouchableOpacity>
            </View>
        </ScrollView>);
    }
}
function mapStateToProps(state, ownProps){
    return {
        contactus: state.root.message.contactus,
    };
}
function mapDispatchToProps(dispatch){
    return {
        messageContactusAction: bindActionCreators(messageContactusAction, dispatch),
        commonAction: bindActionCreators(commonAction, dispatch),
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(MessageContactus);