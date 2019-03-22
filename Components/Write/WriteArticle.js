import React from 'react';
import { StyleSheet, Text, View, FlatList,TextInput 
    ,Image,TouchableOpacity,Keyboard, Animated, Dimensions, Easing
    ,Platform,ActivityIndicator,Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from '../CustomComponents/CheckBox';
import WriteBotton from "./WriteBotton";
import Writecheck from "./Writecheck";
import ImagePicker from 'react-native-image-picker';
import ImagesPicker from 'react-native-image-crop-picker';
import VideoPlayer from '../CustomComponents/VideoPlayer';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import forumApi from '../../api/forum/forumApi'
import WriteVotePreview from './WriteVotePreview';
import KeyEvent from 'react-native-keyevent';
import {emoticons} from '../../utility/index';
import * as userAction from '../../actions/user/userAction';
import * as commonAction from '../../actions/common/commonAction';
import _ from 'lodash';
import {CustomImage} from '../CustomComponents/CustomImage';
import moment from 'moment';
import SubHeader from '../Mould/SubHeader';


const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'white',
        padding:10,
        borderTopWidth:0.5,
        borderTopColor:'#ccc'
    },
    top:{
        width:'100%',
        height:40,
        backgroundColor:'white'
    },
    title:{
        width:'100%',
        height:'100%',
        flexDirection:'row',
    },
    title_view:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'#ccc',
        /*  borderRadius:5,*/
    },
    title_text:{
        width:'100%',
        color:'black',
        padding:0,
        paddingLeft:10,
        fontSize:setFontSize(15),
    },
    checkcontent:{
        borderTopWidth:1,
        borderTopColor:'#ddd',
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'white'
    },
    check:{
        flexDirection:'row',
        marginVertical:8
    },
    checkboxes:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:8,
    },
    checkview:{
        justifyContent:'center',
        alignItems:'center',
    },
    checkbox:{
        width:60,
        marginLeft:8
    },
    write_content:{
        padding:10,
        flex:1,
        height:330,
        backgroundColor:'white'
    },
    write_textput:{
        padding:0,
        fontSize:setFontSize(15),
        height:330,
        textAlignVertical:'top'
    },
    map:{
        flex:1,
    },
    map_text:{
        fontSize:setFontSize(20),
    },
    articleInput:{
        width:'100%',
        fontSize:setFontSize(15),
        textAlignVertical: 'top',
        padding:0,
        // lineHeight:40
    },
    articleContainer:{
        width:'80%',
        height:'80%',
        marginHorizontal:'10%',
        marginTop:20,
        borderWidth:2,
        borderColor:'#eee'
    },
    articleScrollContainer:{
        
    },
    imageContainer:{
        width:'100%',
        marginVertical:12,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width:width*0.8,
        height:200,
        resizeMode:'cover',
        alignSelf:'center',
        backgroundColor:'gray'
    },
    video:{
        width:'100%',
        height:200,
        marginVertical:10,
        // marginHorizontal:20,
        backgroundColor:'black'
    },
});
class WriteArticle extends React.Component {
    static navigationOptions = ({navigation})=>{
        const {params={}} = navigation.state;
        const { state, setParams } = navigation;
        let headerParams = {
            headerTitle: '编辑',
            headerTintColor: '#585858',
            headerStyle: {
                backgroundColor: 'white'
            },
            headerTitleStyle: {
                alignSelf: 'center',
                fontWeight: 'normal',
                color: '#585858'
            },
            headerLeft: (
                <TouchableOpacity style={{marginLeft: 20,}} onPress={()=>{
                    try {
                        Keyboard.dismiss()
                        params.hasOwnProperty('publishAlert')?params.publishAlert():navigation.goBack()
                        // params.hasOwnProperty('willGoBack')&&typeof params.willGoBack == 'function'?params.willGoBack():()=>null
                    } catch (error) {
                        console.log(error)
                    }
                }}>
                    <Text style={{color: '#585858', fontSize:setFontSize(15),}}><Icon name="angle-left" size={30}/></Text>
                </TouchableOpacity> 
            ),
            headerRight: (
                <TouchableOpacity 
                    style={{
                        width: 60,
                        height: 25,
                        borderRadius: 2,
                        backgroundColor: '#d34d3d',
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                     }} 
                     onPress={params.publish}>
                        <Text style={{color: 'white', fontSize:setFontSize(15), textAlign: 'center'}}>发表</Text>
                </TouchableOpacity> 
            ),
            showBottomLine:true
        }
        return {
            header: <SubHeader {...headerParams} navigation={navigation}/>
        }
    }
    constructor(props, context){
        super(props, context);
        
        this.state = {
            title:undefined,
            article:new Array({type:'text',data:''}),
            selection:{start:0,end:0},
            focusIndex:0,
            toolBarAnimation:new Animated.Value(0),
            focus:false,
            location:undefined,
            cid:10,
            uploading:false,
            vote:null,
            publish:false
        }
    }
    componentDidMount() {
        if (!this.props.login) this.props.commonAction.showTip('尚未登录,请登录后操作')
        const { state, setParams } = this.props.navigation;
        // 需要返回提示时打开
        // if (setParams) setParams({publishAlert:this._publishAlert})
        const { params={} } = state
        let {isDraft=false,index=undefined,draft=undefined} = params;
        if (isDraft&&draft) this.setState(JSON.parse(JSON.stringify(draft)));
        setParams({publish:this._publish});
        // 用来控制是否显示分类
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',this._keyboardDidShow)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',this._keyboardDidHide)
        if (Platform.OS=='ios'){
            this.keyboardWillShowListener= Keyboard.addListener('keyboardWillShow',this._keyboardWillShow)
            this.keyboardWillHideListener= Keyboard.addListener('keyboardWillHide',this._keyboardWillHide)
        }
        if (Platform.OS=='android'){
            
            // if you want to react to keyDown
            // KeyEvent.onKeyDownListener((keyCode) => {
            //     console.log(`Key code pressed: ${keyCode}`);
            // });
            // if you want to react to keyUp
            KeyEvent.onKeyUpListener((keyCode) => {
                console.log(`Key code pressed: ${keyCode}`);
                if (keyCode == 67) this._onKeyPress('Backspace')
            });
        }
    }
    componentWillUnmount(){
        Keyboard.removeSubscription(this.keyboardDidShowListener)
        Keyboard.removeSubscription(this.keyboardDidHideListener)
        try {
            if(Platform.OS=='ios'){
                console.log('WriteArticle will unmount')
                Keyboard.removeSubscription(this.keyboardWillShowListener)
                Keyboard.removeSubscription(this.keyboardWillHideListener)
                // Keyboard.removeSubscription(this._keyboardWillChangeFrame)
            }
            if (Platform.OS=='android'){
                // if you are listening to keyDown
                KeyEvent.removeKeyDownListener();
                // if you are listening to keyUp
                KeyEvent.removeKeyUpListener();
            }
        } catch (error) {
            console.log('write article will unmount , but catched : ',error)
        }
        this.props.userAction.getUser(this.props.login)
        // 已经发表,不用再保存草稿
        if (this.state.publish) return;
        this._draftsAction()
    }
    _publishAlert = ()=>{
        if (this.state.uploading) {
            Alert.alert("提示","正在提交发表内容,确认退出吗?",[{
                text:'确认',
                onPress:()=>{this.props.navigation.goBack()}
            },{
                text:'取消',
                onPress:()=>{}
            }])
        }else{
            this.props.navigation.goBack()
        }
    }
    _draftsAction = ()=>{
        let new_draft = this.state;
        delete new_draft.toolBarAnimation;
        delete new_draft.selection;
        delete new_draft.focus;
        delete new_draft.focusIndex;
        delete new_draft.uploading;
        let {params={}} =  this.props.navigation.state
        let {isDraft=false,index=undefined,draft=undefined} = params;
        if (isDraft){
            this.props.userAction.changeDrafts({...new_draft,time:new Date().getTime()},index)
            this.props.commonAction.showTip('已保存到草稿箱')
        }else if (new_draft.title||(new_draft.article.length&&new_draft.article[0].data!='')||new_draft.vote!=null||new_draft.location!=undefined){
            // _.each(new_draft,(value,key)=>{
            //     console.log(value,key)
            //     if (!value) delete new_draft[key]
            // })
            // console.log('write article will unmount : ',new_draft,isDraft,index,draft)
            this.props.userAction.addDrafts({...new_draft,time:new Date().getTime()})
            this.props.commonAction.showTip('已保存到草稿箱')
        }
    }
    _onVotePress = ()=>{
        this.props.navigation.navigate('WriteVote',{setVote:this._setVote,vote:this.state.vote});
    }
    _setVote = (vote)=>{
        // const newVote = {...vote,time:moment().format('YYYY-MM-DD')}
        this.setState({vote});
    }
    _onLocationPress = ()=>{
        Keyboard.dismiss()
        this.props.navigation.navigate('WriteLocation',{setLocation:this._setLocation})
    }
    _keyboardWillShow = (event)=>{
        try {
            if (this.refs.titleInput.isFocused()) return;
        } catch (error) {}
        try {
            let toValue = event.endCoordinates.height
            let duration= event.duration
            Animated.timing(this.state.toolBarAnimation,{
                toValue,
                duration,
                easing:Easing.in(Easing.linear)
            }).start()
        } catch (error) {
            console.log('Animation error : ',error)
        }
    }
    _keyboardDidShow = (event)=>{
        this.setState({focus:true})
        try {
            if (this.refs.titleInput.isFocused()) return;
        } catch (error) {}
    }
    _keyboardWillHide = (event)=>{
        try {
            let toValue = 0
            let duration= event.duration
            Animated.timing(this.state.toolBarAnimation,{
                toValue,
                duration,
                easing:Easing.in(Easing.linear)
            }).start(()=>{
                // console.log('_keyboardWillHide')
            })
        } catch (error) {
            // console.log('Animation error : ',error)
        }
    }
    _keyboardDidHide = (event)=>{
        this.setState({focus:false})
    }
    _publish = async ()=>{
        if (!this.props.login) return this.props.commonAction.showTip('尚未登录,请登录后操作');
        if (this.state.uploading) return;
        this.setState({uploading:true})
        var checkResult = true
        try {
            let hasTitle = await this._checkTitle()
            let hasCategory = await this._checkCategory()
            // 选择立即上传
            // let filesOK = await this._checkFiles()
        } catch (error) {
            checkResult = false
            this.setState({uploading:false})
            this._onFocus()
            return this.props.commonAction.showTip(error);
        }
        // 发布时上传文件
        let asyncCheckResult = await this._checkFilesAsync()
        if (!asyncCheckResult) {
            this.setState({uploading:false})
            return this.props.commonAction.showTip('文件上传失败')
        }
        if (!checkResult) return console.log('不可能到这里的吧....')
        let title = emoticons.stringify(this.state.title) 
        let publishContent = this.state.article.map((content,index)=>{
           switch (content.type) {
                case 'text' :return {type:content.type,data:emoticons.stringify(content.data)};
                case 'image':return {type:content.type,data:content.url};
                case 'video':return {type:content.type,data:content.url}
                default: return {type:content.type,data:emoticons.stringify(content.dasta)};
           }
        })
        var params = {data:JSON.stringify(publishContent),title,cid:this.state.cid}
        if (this.state.location) params.location=this.state.location
        if (this.state.vote) {
            params.vote = JSON.stringify(this.state.vote)
            params.vote = emoticons.stringify(params.vote)
        }
        
        forumApi.publish(params)
        .then(responseJson=>{
            if (responseJson.code == 200){
                this.setState({publish:true})
                let {params={}} = this.props.navigation.state;
                let {isDraft=false,index=undefined,draft=undefined} = params;
                if (isDraft){
                    this.props.userAction.removeDrafts(draft,index)
                }
                this.props.navigation.goBack()
            }else{
                this.props.commonAction.showTip('发表失败,请检查网络后重试')
            }
            this.setState({uploading:false})
        },error=>{
            console.log(error)
            this.setState({uploading:false})
        })
        .catch(error=>{
            console.log(error)
            this.setState({uploading:false})
        })
        
    }
    _checkTitle = ()=>{
        return new Promise((resolve,reject)=>{
            try {
                if (this.state.title&&this.state.title!='') return resolve(true);
                else return reject('没有填写标题')
            } catch (error) {
                reject('没有填写标题')
            }
            
        })
    }
    _checkCategory = ()=>{
        return new Promise((resolve,reject)=>{
            if (this.state.cid != 0) return resolve(true)
            else return reject('没有选择分类')
        })
    }
    _checkFiles = ()=>{
        let article = this.state.article
        return new Promise((resolve,reject)=>{
            let checkFilesTimer = setInterval(()=>{
                let uploadComplete = true;
                let uploadError = false;
                for (let i=0; i<article.length;i++){
                    let content = article[i]
                    if (content.type == 'text') continue;
                    if (content.hasOwnProperty('url')) continue;
                    if (content.hasOwnProperty('error'&&content.error)) {
                        uploadError = true;
                        break;
                    }
                    uploadComplete = false;break;
                    // 如果需要确定发表时才上传文件,使用下面的代码
                    // await this._uploadFile(content.file)
                }
                if (uploadError) {
                    clearInterval(checkFilesTimer);
                    reject(false)
                }
                if (uploadComplete) {
                    clearInterval(checkFilesTimer)
                    resolve(true);
                }
            },1000)
        })
    }
    _checkFilesAsync = ()=>{
        return new Promise(async (resolve,reject)=>{
            let article = new Array(...this.state.article)
            let uploadComplete = true;
            let uploadError = false;
            for (let i=0; i<article.length;i++){
                let content = article[i]
                if (content.type == 'text') continue;
                if (content.hasOwnProperty('url')) continue;
                // if (content.hasOwnProperty('error'&&content.error)) {
                //     uploadError = true;
                //     break;
                // }
                // 如果需要确定发表时才上传文件,使用下面的代码
                let uploadResult = await this._uploadFileAsync(content.file)
                if (uploadResult==false) {
                    uploadComplete = false;
                    console.log('upload fail : ',content)
                    this.props.commonAction.showTip(`${content.file.name} 上传失败`)
                    Alert.alert('提示',`是否删除${content.file.name}`,[
                        {text:'删除',onPress:()=>{
                            article.splice(i,1)
                            this.setState({article})
                        }}
                    ])
                    return resolve(false)
                }
            }
            if (uploadError) {
                resolve(false)
            }
            if (uploadComplete) {
                resolve(true);
            }
        })
    }
    _uploadFileAsync = (file)=>{
        return new Promise((resolve,reject)=>{
            forumApi.uploadFile(file)
            .then(responseJson=>{
                if (responseJson.code == 200) {
                    this._uploadFileSuccess(file,responseJson)
                    resolve(true)
                }else{
                    this._uploadFileError(file)
                    resolve(false)
                }
            },error=>{
                this._uploadFileError(file)
                resolve(false)
            })
        })
    }
    _uploadFile = (file)=>{
        return new Promise((resolve,reject)=>{
            forumApi.uploadFile(file)
            .then(responseJson=>{
                if (responseJson.code == 200) {
                    this._uploadFileSuccess(file,responseJson)
                    resolve(true)
                }else{
                    this._uploadFileError(file)
                    reject(false)
                }
            },error=>{
                console.log('upload file error : ',error)
                this._uploadFileError(file)
                reject(false)
            })
        })
    }
    _uploadFileSuccess = (file,responseJson)=>{
        var article = new Array(...this.state.article);
        var newArticle = article.map((content,index)=>{
            if (content.hasOwnProperty('file') && content.file.uri == file.uri){
                // 确定为同一个
                return Object.assign({},content,{url:responseJson.info})
            }
            return content;
        })
        this.setState({article:newArticle})
    }
    _uploadFileError = (file,error)=>{
        var article = new Array(...this.state.article);
        var newArticle = article.map((content,index)=>{
            if (content.hasOwnProperty('file') && content.file.uri == file.uri){
                // 确定为同一个
                return Object.assign({},content,{error:true})
            }
            return content;
        })
        this.setState({article:newArticle})
    }
    _getImages = ()=>{
        ImagesPicker.openPicker({
            multiple: true,
            mediaType: "photo",
            compressImageQuality:0.5
        }).then(images => {
            if (Array.isArray(images)&&images.length>0){
                let imageContents = [];
                for (let index = 0; index < images.length; index++) {
                    const image = images[index];
                    let imageFile = Object.assign({},image,{type:image.mime,name:image.path.replace(/.*\/(.?\.\S+)/,'$1'),uri:image.path})
                    imageContents.push(imageFile)
                }
                this._addImages(imageContents)
            }
        });
    }
    _addImages = (images)=>{
        var article = new Array(...this.state.article);
        let focusContent= article[this.state.focusIndex]
        var selection = {start:0,end:0}
        let imageContents = images.map((image,index)=>{
            return {type:'image',data:image.uri,file:image}
        })
        if (this.state.selection.start == 0 // 编辑开头处
        ){
            article.splice(this.state.focusIndex,0,...imageContents)
        }
        else if (this.state.selection.end == focusContent.data.length - 1 // 编辑尾部处
        ){
            if (focusContent.type == 'text' && focusContent.data == ''){
                article.splice(this.state.focusIndex,0,...imageContents)
            }else{
                article.push(...imageContents)
            }
            article.push({type:'text',data:''})
        }else{
            let data = focusContent.data;
            let datas = [data.slice(0,this.state.selection.start),data.slice(this.state.selection.end)]
            let appendItems = [{type:'text',data:datas[0]},...imageContents,{type:'text',data:datas[1]}]
            article.splice(this.state.focusIndex,1,...appendItems)
            selection = {start:datas[1].length-1,end:datas[1].length-1}
        }
        this.setState({article,selection});
        this.refs.hasOwnProperty('contentScroll')&&this.refs.contentScroll.scrollToEnd()
    }
    _getImage = ()=>{
        var options = {
            title: '选择图片',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'图库',
            customButtons: [
                {name: 'images', title: '多张图片'},
            ],
            quality:0.5,
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
              this._getImages()
            }
            else {
              let source = { uri: response.uri };
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
              this._addImage(response.uri,Object.assign({},response,{name:response.fileName,size:response.fileSize}))
            }
          });
    }
   
    _addImage = (data,file)=>{
        var article = new Array(...this.state.article);
        // let lastContent = article[article.length-1]
        let focusContent= article[this.state.focusIndex]
        var selection = {start:0,end:0}
        let imageContent = {type:'image',data,file}
        if (this.state.selection.start == 0 // 编辑开头处
        ){
            article.splice(this.state.focusIndex,0,imageContent)
        }
        else if (this.state.selection.end == focusContent.data.length - 1 // 编辑尾部处
        ){
            if (focusContent.type == 'text' && focusContent.data == ''){
                article[article.length-1] = imageContent
            }else{
                article.push(imageContent)
            }
            article.push({type:'text',data:''})
        }else{
            let data = focusContent.data;
            let datas = [data.slice(0,this.state.selection.start),data.slice(this.state.selection.end)]
            let appendItems = [{type:'text',data:datas[0]},imageContent,{type:'text',data:datas[1]}]
            article.splice(this.state.focusIndex,1,...appendItems)
            selection = {start:datas[1].length-1,end:datas[1].length-1}
        }
        this.setState({article,selection});
        this.refs.hasOwnProperty('contentScroll')&&this.refs.contentScroll.scrollToEnd()
        // 立即上传文件
        // this._uploadFile(file)
    }
    _getVideo = ()=>{
        var options = {
            title: '选择视频',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'录制',
            chooseFromLibraryButtonTitle:'媒体库',
            customButtons:[{name:'tip',title:'文件大小必须在20M以内'}],
            mediaType:'video',
            videoQuality:'low',
            durationLimit:60,
            noData:true,
            storageOptions: {
              waitUntilSaved: true,
              skipBackup: true,
              path: 'videos'
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
              if (response.uri.search(/\.(jpg|jpeg|png)/i)!=-1) {
                  return alert('请选择正确的视频文件')
              }
              let source = { uri: response.uri };
              // if (response.fileSize > 2048)
              // You can also display the image using data:
              // let source = { uri: 'data:image/jpeg;base64,' + response.data };
              this._addVideo(response.uri,Object.assign({},response,{name:response.path.replace(/.*\/(.*)/,'$1'),size:response.fileSize}))
            }
          });
    }
    _addVideo = (data,file)=>{
        var article = new Array(...this.state.article);
        // let lastContent = article[article.length-1]
        let focusContent= article[this.state.focusIndex]
        var selection = this.state.selection;
        let videoContent = {type:'video',data,file}
        if (this.state.selection.start == 0 // 编辑开头处
        ){
            article.splice(this.state.focusIndex,0,videoContent)
        }
        else if (this.state.selection.end == focusContent.data.length - 1 // 编辑尾部处
        ){
            if (focusContent.type == 'text' && focusContent.data == ''){
                article[article.length-1] = videoContent
            }else{
                article.push(videoContent)
            }
            article.push({type:'text',data:''})
        }else{
            let data = focusContent.data;
            let datas = [data.slice(0,this.state.selection.start),data.slice(this.state.selection.end)]
            let appendItems = [{type:'text',data:datas[0]},videoContent,{type:'text',data:datas[1]}]
            article.splice(this.state.focusIndex,1,...appendItems)
            selection = {start:datas[1].length-1,end:datas[1].length-1}
        }
        this.setState({article,selection});
        this.refs.hasOwnProperty('contentScroll')&&this.refs.contentScroll.scrollToEnd()
        
        // this._uploadFile(file)
    }
    _setLocation = (location)=>{
        this.setState({location})
    }
    _onFocus = ()=>{
        var lastIndex = this.state.article.length - 1
        try{
            var lastTextInputComponent =  this.refs['textInput'+lastIndex]
            lastTextInputComponent.focus()
        } catch(error){
            console.log('can not onfocus')
        }
    }
    _onBlur = ()=>{
        Keyboard.dismiss()
    }
    _onKeyPress = (key,index)=>{
        // android端可以点击删除,现在无法监听Android删除键的点击事件 FIXED use KeyEvent from react-native-keyevent only android
        // if (Platform.OS=='android') return;
        if (this.refs.titleInput&&this.refs.titleInput.isFocused) return;
        if (!index) index=this.state.focusIndex;
        // console.log(key,index,typeof(key),key=='Backspace',this.state.selection.start == 0 && this.state.selection.end == 0)
        if (this.state.selection.start == 0 && this.state.selection.end == 0 && key=='Backspace'){
            var length = this.state.article.length
            if (length > 1 && index > 0){
                let preContentType = this.state.article[index-1].type
                switch (preContentType){
                    case 'text':{
                        // can not do it
                        let article = new Array(...this.state.article)
                        let preIndex = index-1
                        let removeArticle = article[index]
                        let preArticle = article[preIndex]
                        let start = preArticle.data.length-1
                        let end = start;
                        let data =  preArticle.data+removeArticle.data;
                        article.splice(preIndex,1)
                        article[preIndex] = {type:'text',data}
                        // let selection = {start,end}
                        let focusIndex = preIndex;
                        try {
                            let preTextInputComponent = this.refs['textInput'+preIndex]
                            preTextInputComponent.focus()
                        } catch (error) {
                            
                        }
                        this.setState({article,focusIndex})
                        break;
                    }
                    case 'video':
                    case 'image':{
                        // remove last textInput and last Image
                        let article = new Array(...this.state.article)
                        article.splice(index-1,1)
                        let lastIndex = article.length-1
                        if (lastIndex>-1 && article[lastIndex].type=='text'){
                            try {
                                let lastTextInputComponent = this.refs['textInput'+lastIndex]
                                lastTextInputComponent.focus()
                            } catch (error) {
                                
                            }
                        }else{
                            article.push({type:'text',data:''})
                        }
                        this.setState({article})
                        break;
                    }
                    default:return;
                }
            }
        }
    }
    _textInputCreate = (content,index,props={})=>{
        let key = index;
        let length = this.state.article.length
        var autoFocus = false
        var placeholder = ''
        if (key == length - 1) autoFocus = true
        if (length == 1) placeholder = '内容'
        return (
            <TextInput 
              defaultValue={content.data} 
              key={key} 
              ref={'textInput'+key}
              onKeyPress={(event)=>this._onKeyPress(event.nativeEvent.key,key)}
              onChangeText={(text) => {
                var article = new Array(...this.state.article);
                article[key].data = text
                this.setState({article});
              }}
              onContentSizeChange={(event) => {
                var article = new Array(...this.state.article);
                let height = event.nativeEvent.contentSize.height
                // console.log('height update',height)
                article[key].height = height+10;//10-->对于显示效果的补差
                this.setState({article});
              }}
              onSelectionChange={(event) => {
                  var selection = event.nativeEvent.selection
                //   console.log('selection : ',selection.start,selection.end)
                  this.setState({selection})
              }}
            //   selection={index==this.state.focusIndex?this.state.selection:null}
              onFocus={()=>this.setState({focusIndex:key})}
              style={[styles.articleInput, {height: Math.max(40, content.height)}]}
              value={content.data}
              autoFocus={autoFocus}
              multiline={true}
              placeholder={placeholder}
              placeholderTextColor='#eee'
              autoCapitalize='none' 
              autoCorrect={false} 
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
            //   onSubmitEditing={()=>console.log('submit')}
              {...props}
              />
        )
    }
    onCategoryPress = (cid)=>{
        if (this.state.cid==cid) this.setState({cid:0})
        else this.setState({cid});
    }
    _removeItem = (content,index)=>{
        Alert.alert('删除','确认删除吗?',[
            {text:'删除',onPress:()=>{
                let article = this.state.article;
                article.splice(index,1);
                this.setState({article})
            }}
        ])
    }
    _renderItem = ({item,index})=>{

        let content = item;
        let key = index;
        switch(content.type){
            case 'image':
                return (
                    <TouchableOpacity key={key} style={styles.imageContainer} delayLongPress={1000} onLongPress={()=>this._removeItem(content,key)}>
                        <CustomImage source={{uri:content.data}} style={styles.image}/>
                    </TouchableOpacity>
                );
            case 'text' :return this._textInputCreate(content,key);
            case 'video':
                return (
                    <VideoPlayer 
                        ref={`video${key}`}
                        key={key}
                        rate={0}
                        paused={true}
                        repeat={false} 
                        playInBackground={false}
                        playWhenInactive={false}
                        source={{uri:content.data}} 
                        controlTimeout={ 15000 }         // hide controls after ms of inactivity.
                        //navigator={ navigator }        // prop from React Native <Navigator> component
                        seekColor={ '#FFF' }             // fill/handle colour of the seekbar
                        videoStyle={ {} }                // Style appended to <Video> component
                        style={styles.video}             // Style appended to <View> container
                        // event callbacks
                        // onError={ () => {} }             // Fired when an error is encountered on load
                        // onBack={ () => {} }              // Function fired when back button is pressed.
                        // onEnd={ () => {
                        //     // console.log(this.refs[`video${key}`])
                        //     // this.refs[`video${key}`].player.ref.seek(0)
                        // } }               // Fired when the video is complete.
                        // disabling individual controls
                        disableFullscreen={ false }      // Used to hide the Fullscreen control.
                        disableSeekbar={ false }         // Used to hide the Seekbar control.
                        disableVolume={ false }          // Used to hide the Volume control.
                        disableBack={ false }            // Used to hide the Back control.
                        disableTimer={ false }           // Used to hide the Timer control.
                    />
                );
            default : return this._textInputCreate(content,key);
        }
    }
    _renderHeader = ()=>{
        return null;
    }
    _renderFooter = ()=>{
        const vote = this.state.vote;
        if (vote){
            return <WriteVotePreview vote={vote}/>
        }
        return null;
    }
    _renderCheckBoxes = ()=>{
        const categorys = this.props.category
        let contents = categorys.map((category,index)=>{
            let name = category.category_name
            let cid = category.id
            let display=0
            if (category.hasOwnProperty('display')) display = category.display;
            if (display!=1||display==0){
                return (
                    <View style={styles.checkview} key={cid}>
                        <CheckBox
                            style={styles.checkbox}
                            onClick={()=>this.onCategoryPress(cid)}
                            isChecked={this.state.cid==cid}
                            leftText={name}
                            checkBoxColor='#8a8a8a'/>
                    </View>
                )
            }
            return null;
        })
        return (
            <View horizontal style={styles.checkboxes}>{contents}</View>
        )
    }
    _renderTitle = ()=>{
        return (
            <View style={styles.top}>
                <View style={styles.title}>
                    <View style={styles.title_view}>
                        <TextInput 
                            ref='titleInput' 
                            placeholder="标题" 
                            style={styles.title_text} 
                            underlineColorAndroid="transparent"
                            onChangeText={(title)=>this.setState({title})}
                            value={this.state.title}
                        />
                    </View>
                </View>
            </View>
        )
    }
    render() {
        return (
            <View style={{flex:1}}>
                {this._renderTitle()}
                {/* <TouchableOpacity  activeOpacity={1}  style={styles.write_content} onPress={this._onFocus}> */}
                <FlatList
                    ref='contentScroll'
                    style={styles.write_content}
                    data={this.state.article}
                    extraData={this.state}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index}
                    keyboardShouldPersistTaps='handled'
                    // ListHeaderComponent={this._renderHeader()}
                    ListFooterComponent={this._renderFooter()}
                    // ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                />
                {/* </TouchableOpacity> */}
                {/* <WriteVoteStyle vote={this.state.vote}/> */}
                {this.state.location&&
                <View style={{width:'100%',height:40,justifyContent:'center',alignItems:'flex-end',paddingHorizontal:10,borderBottomColor:'#888',borderBottomWidth:1}}>
                    <Text style={{textAlign:'right'}}>{this.state.location}</Text>
                </View>}
               {/* {this._renderCheckBoxes()}*/}
                <Writecheck/>
                <WriteBotton 
                    style={{bottom:this.state.toolBarAnimation}}
                    addImage={this._getImage}
                    addVideo={this._getVideo}
                    addLocation={this._onLocationPress}
                    onVotePress={this._onVotePress}
                />
                {/* {this.state.uploading &&
                    <View style={{position:'absolute',flex:1,width:'100%',height:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'#0008'}} >
                        <ActivityIndicator size='large'/>
                    </View>
                } */}
            </View>
        );
    }
}
function mapStateToProps(state, ownProps){
    return {
        login:state.root.user.login,
        publish:state.root.forum.publish,
        category:state.root.forum.category
    };
}
function mapDispatchToProps(dispatch){
    return {
        userAction: bindActionCreators(userAction,dispatch),
        commonAction:bindActionCreators(commonAction,dispatch)
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(WriteArticle);