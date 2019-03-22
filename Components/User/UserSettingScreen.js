import React from 'react';
import { StyleSheet, Text, View,TextInput,ScrollView ,Image,TouchableOpacity,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as settingAction  from '../../actions/user/settingAction';
import * as commonAction from "../../actions/common/commonAction";
import * as userAction from '../../actions/user/userAction';
import ImagePicker from 'react-native-image-picker';
import * as constStyle from '../StyleConstant';
import ChinaRegionWheelPicker from 'rn-wheel-picker-china-region';
import SubHeader from '../Mould/SubHeader';
import Images from '../../imagesRequired';

const styles = StyleSheet.create({
    scroll:{
        flex:1,
        marginTop:-constStyle.headerHeight,
        backgroundColor:'#F6F6F6'
    },
    set_header:{
        backgroundColor:'#D34D3D',
        height:120+constStyle.headerHeight,
        paddingTop:constStyle.headerHeight,
        // overflow:'visible',
        alignItems:'center',
        justifyContent:'center',
    },
    header_background:{
        position:'absolute',
        width:'100%',
        marginTop:-constStyle.headerHeight,
        height:120+constStyle.headerHeight,
        resizeMode:'cover',
    },
    user_img:{
        height:70,
        width:70,
        borderRadius:35
    },
    user_name:{
        marginTop:10,
        color:'white',
        textAlign:'center',
        fontSize:setFontSize(18),
        backgroundColor:'transparent'
    },
    set_content:{
        alignItems:'center',justifyContent:'center',
    },
    user_input:{
        flex:1,
        alignSelf:'center',
        textAlign:'right',
    },
    text_input:{
        flex:1,
        textAlign:'right',
        paddingVertical:5,
    },
    change_button:{
        alignItems:'center',justifyContent:'center',
        flex:1,
        width:300,
        height:40,
        backgroundColor:'#D34D3D',
        marginTop:30,
        borderRadius:3,
    },
    change_view:{
        alignItems:'center',justifyContent:'center'
    },
    change_text:{
        color:'white',
        fontSize:setFontSize(20),
        textAlign:'center'
    },
    set_bottom:{
        marginTop:30,
    },

    userContainer:{
        backgroundColor: '#fff',
        marginTop:2,
        padding: 8,
        flexDirection:'row',
        width:'100%',
        alignItems:'center',
    },
    userText:{
        color:'#585858',
        fontSize:setFontSize(15),
    },
    angleright:{
       position:'absolute',
        right:10,
        color:'#ddd',
        fontSize:setFontSize(25)
    },
});
class UserSettingScreen extends React.Component {
    static navigationOptions = ({navigation})=>{
        let headerTintColor='white'
        let headerStyle = {
            height:constStyle.headerHeight,
            backgroundColor:'transparent'
        }
        return {
            header:<SubHeader navigation={navigation} headerStyle={headerStyle} headerTintColor={headerTintColor}/>
        }
    };
    constructor(props, context){
        super(props, context);
        this.state = {
            input:{
                alias:null,
                age:null,
                sex:'男',
                user_area:null,
                introduce:null,
                ...this.props.getsetting
            },
            changed:false,
            isPickerVisible: false,
        };
        // this.props.settingAction.getSetting(this.props.login);
        this.onsubmit = this.onsubmit.bind(this);
        this.onaliasChangeText = this.onaliasChangeText.bind(this);
        this.onageChangeText = this.onageChangeText.bind(this);
        this.onsexChangeText = this.onsexChangeText.bind(this);
        this.onintroduceChangeText = this.onintroduceChangeText.bind(this);
        this._getImage = this._getImage.bind(this)
    }

    componentDidMount() {
        if (this.props.getsetting&&this.props.getsetting.hasOwnProperty('age')) return this.setState({input:this.props.getsetting});
        this.props.settingAction.getSetting(this.props.login);
    }
    componentWillUnmount(){
        this.state.changed && this.onsubmit()
        // this.props.settingAction.settingAction(this.state.input)
    }
    componentWillReceiveProps(nextProps) {
        if (!nextProps.login){
            this.props.navigation.goBack()
        }else{
            let input = {...nextProps.getsetting};
            if (input.sex == 0 ) input.sex='女'; 
            if (input.sex == 1 ) input.sex='男';
            this.setState({input})
        }
    }
    
    onsubmit(){
        let input = this.state.input
        for (var key in input) {
            if (input.hasOwnProperty(key)) {
                var item = input[key];
                if (item == null || item == ''){
                    input[key] = this.props.userdata[key]
                    // return;
                    // return this.props.commonAction.showTip('请完善信息后提交')
                }
            }
        }
        if (input.sex == '女' ) input.sex=0; 
        if (input.sex == '男' ) input.sex=1;
        delete input.avatar;
        input.user_area = input.user_area.replace(',','，')
        let params = {alias:input.alias,age:input.age,sex:input.sex,user_area:input.user_area,introduce:input.introduce}
        this.props.settingAction.postSetting(params);
    }
    onaliasChangeText(text){
        var state = Object.assign({},this.state,{
            input:{
                alias:text,
                age:this.state.input.age,
                sex:this.state.input.sex,
                user_area:this.state.input.user_area,
                introduce:this.state.input.introduce,
            },
            changed:true
        });
        this.setState(state);
    }
    onageChangeText(text){
        var state = Object.assign({},this.state,{
            input:{
                alias:this.state.input.alias,
                age:text,
                sex:this.state.input.sex,
                user_area:this.state.input.user_area,
                introduce:this.state.input.introduce,
            },
            changed:true
        });
        this.setState(state);
    }
    onsexChangeText(text){
        let sex = text==1?'0':(text=='男'?'0':'1')
        var state = Object.assign({},this.state,{
            input:{
                alias:this.state.input.alias,
                age:this.state.input.age,
                sex:sex,
                user_area:this.state.input.user_area,
                introduce:this.state.input.introduce,
            },
            changed:true

        });
        this.setState(state);
    }
    onintroduceChangeText(text){
        var state = Object.assign({},this.state,{
            input:{
                alias:this.state.input.alias,
                age:this.state.input.age,
                sex:this.state.input.sex,
                user_area:this.state.input.user_area,
                introduce:text,
            },
            changed:true
        });
        this.setState(state);
    }
    _onPress2Show=()=> {
        this.setState({ isPickerVisible: true });
    }
    _onPressCancel=()=> {
        this.setState({ isPickerVisible: false });
    }
    _onPressSubmit=(params)=> {
        this.setState({ isPickerVisible: false });
        var state = Object.assign({},this.state,{
            input:{
                alias:this.state.input.alias,
                age:this.state.input.age,
                sex:this.state.input.sex,
                user_area:`${params.province},${params.city},${params.area}`,
                introduce:this.state.input.introduce,
            },
            changed:true
        });
        this.setState(state);
    }
    onSignOutPress = ()=>{
        this.props.settingAction.signout()
    }
    _getImage(){
        var options = {
            title: '选择头像',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            noData:true,
            storageOptions: {
                waitUntilSaved: true,
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let file = Object.assign({},response,{name:response.fileName,size:response.fileSize})
                this.props.userAction.changeAvatar(file)
            }
        });
    }
    _changeBackground = ()=>{
        var options = {
            title: '更换背景',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            noData:true,
            storageOptions: {
                waitUntilSaved: true,
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let file = Object.assign({},response,{name:response.fileName,size:response.fileSize})
                this.props.userAction.changeBackground(file)
            }
        });
    }
    render() {

        var alias = this.props.getsetting && this.props.getsetting.hasOwnProperty('alias')?this.props.getsetting.alias:'用户名'
        var age = this.props.getsetting && this.props.getsetting.hasOwnProperty('age')?this.props.getsetting.age:'年龄'
        var sex = this.state.input.hasOwnProperty('sex')?this.state.input.sex:'性别'
        sex = typeof sex == 'number' ? (sex==1?'男':'女') : sex;
        var introduce= this.props.getsetting && this.props.getsetting.hasOwnProperty('introduce')?this.props.getsetting.introduce:'签名'
        var avatar = this.props.userdata && this.props.userdata.hasOwnProperty('avatar')&&this.props.userdata.avatar&&this.props.userdata.avatar!=''?{uri:this.props.userdata.avatar}:Images.defaultAvatar;
        var backgroundImage = this.props.userdata && this.props.userdata.hasOwnProperty('background_image')&&this.props.userdata.background_image&&this.props.userdata.background_image!=''?{uri:this.props.userdata.background_image}:undefined;
        var user_area = this.props.getsetting && this.props.getsetting.hasOwnProperty('user_area')?this.props.getsetting.user_area:'选择地区'
        return (
            <View style={styles.scroll}>
                <TouchableOpacity style={styles.set_header}  activeOpacity={1} onPress={this._changeBackground}>
                    {backgroundImage&&<Image source={backgroundImage} style={styles.header_background}/>}
                    <TouchableOpacity onPress={this._getImage}>
                        <Image source={avatar} style={styles.user_img}/>
                    </TouchableOpacity>
                    <Text style={styles.user_name}>有料用户 </Text>
                </TouchableOpacity>
                <View style={styles.set_content}>
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>用户名</Text>
                        <Text style={styles.text_input} >{this.props.getsetting.user_name}</Text>
                    </View>        
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>昵称</Text>
                        <TextInput style={styles.user_input} placeholder={alias} value={this.state.input.alias} underlineColorAndroid="transparent" onChangeText={this.onaliasChangeText}></TextInput>
                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>年龄</Text>
                        <TextInput style={styles.user_input} placeholder={age} value={this.state.input.age} underlineColorAndroid="transparent" onChangeText={this.onageChangeText}></TextInput>
                    </View>
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>性别</Text>
                         <Text style={styles.text_input} onPress={()=>this.onsexChangeText(sex)}>{this.state.input.sex==1?'男':'女'}</Text>
                    </View>
                    <TouchableOpacity style={styles.userContainer} onPress={()=>this._onPress2Show()}>
                        <Text style={styles.userText}>地区</Text>
                        <Text  style={styles.text_input}>{this.state.input.user_area || user_area }</Text>
                    </TouchableOpacity>
                    <ChinaRegionWheelPicker
                        isVisible={this.state.isPickerVisible}
                        navBtnColor={'#d34d3d'}
                        selectedProvince={'上海'}
                        selectedCity={'上海'}
                        selectedArea={'宝山区'}
                        transparent
                        animationType={'fade'}
                        onSubmit={this._onPressSubmit.bind(this)} // 点击确认_onPressSubmit
                        onCancel={this._onPressCancel.bind(this)} // 点击取消_onPressCancel
                        androidPickerHeight={100}   // 安卓手机下可以设置picker区域的高度
                    />
                    <View style={styles.userContainer}>
                        <Text style={styles.userText}>个性签名</Text>
                        <TextInput style={styles.user_input} placeholder={introduce} value={this.state.input.introduce} underlineColorAndroid="transparent" onChangeText={this.onintroduceChangeText}></TextInput>
                    </View>
                </View>
                <View style={styles.set_bottom}>
                    <TouchableOpacity style={styles.userContainer}  onPress={this.onSignOutPress}>
                        <Text style={[styles.userText,{paddingVertical:5}]}>退出</Text>
                        <Icon name="angle-right"style={styles.angleright}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        postsetting: state.root.user.postsetting,
        getsetting: state.root.user.getsetting,
        userdata : state.root.user.userdata,
        login: state.root.user.login,
    };
}
function mapDispatchToProps(dispatch){
    return {
        settingAction: bindActionCreators(settingAction, dispatch),
        userAction:bindActionCreators(userAction,dispatch),
        commonAction: bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(UserSettingScreen);