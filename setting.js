import { cloneElement } from "react";
import { Dimensions,PixelRatio,Platform,StyleSheet, Text,Image } from "react-native";
import _ from 'lodash';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const pxScale = PixelRatio.get();
const fontScale = PixelRatio.getFontScale();
const defaultScale = 2;
const widthScale = 750 / defaultScale;
const heightScale = 1334 / defaultScale;
const scale = Math.min(screenHeight / heightScale, screenWidth / widthScale);
const maxFontSize = 22;
const maxFontScale= 1.25;

const statusBarHeight = Platform.select({
  ios:Platform.Version>11?44:20,
  android:0
})
const bottomHeight = Platform.select({
  ios:Platform.Version>11?44:0,
  android:0
})


global.statusBarHeight = statusBarHeight;
global.bottomHeight  = bottomHeight;
global.screenHeight = screenHeight;
global.screenWidth = screenWidth;
global.pxScale = pxScale;
global.fontScale = fontScale;
global.setFontSize = (fontSize)=>{
  return fontSize;
  if (Platform.OS != 'ios') return fontSize;
  return fontSize>16?fontSize - 1:fontSize;
  let size = Math.round(fontSize * scale );
  // console.log(fontSize,size / defaultScale)
  return size ;// defaultScale
};


__DEV__ && console.log({screenHeight,screenWidth,pxScale,fontScale,widthScale,heightScale,scale})

Text.prototype.render = _.wrap(Text.prototype.render, function (func, ...args) {
  let originText = func.apply(this, args);
  let style = _.result(this.props,'style',{})
  // 转换为object
  if (typeof style === 'number') {
    style = StyleSheet.flatten(style);
  }
  let allowFontScaling = _.result(this.props,'allowFontScaling',false)
  let fontSize = _.result(style,'fontSize',0)
  // max font size
  // if (fontSize>maxFontSize) {
  //   style = Array.isArray(style)
  //   ? [...style,{fontSize:maxFontSize}]
  //   : [style,{fontSize:maxFontSize}]
  // }
  // max font scale
  // if (fontScale>maxFontScale && allowFontScaling) {
  //   style = Array.isArray(style)
  //   ? [...style,{fontSize:fontSize*maxFontScale}]
  //   : [style,{fontSize:fontSize*maxFontScale}]      //fontScale
  //   // style = Object.assign({},style,{})
  // }
  // style = Object.assign({},style,{fontSize});
  return cloneElement(originText, {
      // selectable:true,
      // adjustsFontSizeToFit:true ,
      allowFontScaling:false,
      style
  });
});



// NOTE: 主要是为了显示百度的某些图片====>以后可以删除的
// Image.prototype.render = _.wrap(Image.prototype.render, function (func, ...args) {
//   let originImage = func.apply(this, args);
//   let source = this.props.source;
//   console.log(typeof source ,source)//&& _.result(source,'uri','').indexOf('baidu')!=-1 )
//   if (typeof source === 'object' &&  _.result(source,'uri','').indexOf('baidu')!=-1){
//       let headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'};
//       let method = 'GET';
//       let cache = 'force-cache';
//       source = Object.assign({},source,{headers,method,cache})
//   }
//   return cloneElement(originImage,{source})
// });

//fontSize\s*:\(([0-9]{2})\*pxScale/fontScale\)/2
if (!__DEV__){
  global.console = {
    log:()=>{},
    warn:()=>{},
  }
}

