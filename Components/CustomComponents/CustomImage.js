import React,{ Component } from "react";
import { View, Text, Image, TouchableOpacity, Modal , Dimensions} from "react-native";
import {default as ProgressImage,createImageProgress} from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import _ from 'lodash';
class CustomImage_Progress extends Component{
    constructor(props){
        super(props)
    }
    render(){
        try {
            if (typeof this.props.source == 'object' && this.props.source.hasOwnProperty('uri') && this.props.source.uri.indexOf('http') != -1){
                return (
                    <ProgressImage
                        indicator={Progress.CircleSnail} 
                        indicatorProps={{
                            color: '#aaa',
                        }} 
                        {...this.props}
                    />
                )
            }else{
                console.log('custom image render react native image ',this.props.source)
                return <Image {...this.props}/>
            }
        } catch (error) {
            console.log('custom image render catched : ',this.props,error)
            return <Image {...this.props}/>
        }
        
    }
}

class CustomImage extends Component{
    constructor(props){
        super(props)
        this.state = {
            width:0,
            height:0,
            initWidth:0,
            initHeight:0
        }
    }
    componentDidMount() {
        if (typeof this.props.source == 'object' && this.props.source.hasOwnProperty('uri')){
            let uri = this.props.source.uri;
            let w = uri.replace(/.*w=(\w*)&*.*/,'$1')
            let h = uri.replace(/.*h=(\w*)&*.*/,'$1')
            if (w&&h&&w!=uri&&h!=uri){
                return this.setState({width:w,height:h})
            }
            Image.getSize(uri,(width,height)=>{
                this.setState({width,height})
            },error=>{
                console.log('Image getSize error : ',uri,error)
            })
        }
    }
    layoutImage = (event)=>{
        let initWidth = event.nativeEvent.layout.width;  
        let initHeight = event.nativeEvent.layout.height;
        // 已经layout一次
        if (initWidth==this.state.width&&initHeight==this.state.height) return;
        // 保留判断方法,不一定正确
        // if (this.state.initWidth==0&&this.state.initHeight==0) 
        this.setState({initWidth,initHeight})
    }
    render(){
        let screenHeight = Dimensions.get('window').height
        let {width,height,initWidth,initHeight} = this.state;
        let imageHeight= screenHeight*0.3;
        if (initWidth!=0&&height!=0) {
            imageHeight= Math.ceil( initWidth*(height/width) )
            // if (this.props.source.uri=='http://www.ulapp.cc/data/attachment/editor/20171123/1511428020157848.jpg'){
            //     console.log('Image geSize : ',width,height,imageHeight,initWidth,initHeight)
            // }
        }
        let source = this.props.source;
        let headers = {};
        let method = 'GET'
        let cache = 'force-cache'
        let uri = _.result(this.props,'source.uri','')
        if (uri!=''){//网络图片
            if (uri.indexOf('baidu')!=-1){
                headers = {
                    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
                }
            }
            source = Object.assign({},source,{headers,method,cache})
        }
        if (typeof source == 'object' && _.result(source,'uri','').indexOf('baidu')!=-1){
            source.headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'};
            source.method = 'GET'
            source.cache = 'force-cache'
        }
        let resizeMode = this.props.hasOwnProperty('resizeMode')?this.props.resizeMode:'contain';
        let resizeMethod = imageHeight>screenHeight ? 'resize':'auto'
        return <Image {...this.props} source={source}  resizeMode={resizeMode} resizeMethod={resizeMethod} style={[this.props.style,imageHeight!=0&&{height:imageHeight}]} onLayout={this.layoutImage}/>
    }
}

class CustomHeadersImage extends Component{
    render(){
        let source = this.props.source;
        if (typeof source == 'object' && _.result(source,'uri','').indexOf('baidu')!=-1){
            source.headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'};
            source.method = 'GET'
            source.cache = 'force-cache'
        }
        return <Image {...this.props} source={source}/>
    }
}
export  {
    CustomImage,
    CustomHeadersImage,
    CustomImage_Progress,
};
