import React from 'react';
import { StyleSheet, Text, View, Dimensions,TextInput,ScrollView ,Image,TouchableOpacity} from 'react-native';
import Swiper from 'react-native-swiper';

const {width,height} = Dimensions.get('window')

const styles = StyleSheet.create({
    content:{
        height:200,
        paddingTop:5,
        paddingBottom:10,
        borderBottomColor:'#ddd',
        borderBottomWidth:1,
    },
    swiper_content:{
        marginTop:5,
        backgroundColor:'white',
    },
    swiper_title:{
        fontSize:setFontSize(17),
        color:'#585858',
    },
    swiper_img:{
       width:400,
    },
});

class NewsSwiper extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            swiperShow:false,
        };

    }
    componentDidMount(){
        this.setState({swiperShow:true});
        this.initTimer = setTimeout(()=>{
            
            clearTimeout(this.initTimer)
        },1000)
    }

    render() {
        if(this.state.swiperShow&&this.props.info!=null){
            if (Array.isArray(this.props.swiper) && this.props.swiper.length>1){
                return (
                    <View style={styles.content}>
                        <Swiper
                            loop={true}
                            index={0}
                            width={width-40}
                            autoplay={true}
                            autoplayTimeout={5}
                            pagingEnabled={true}
                            removeClippedSubviews={true}
                            automaticallyAdjustContentInsets={true}
                            paginationStyle={{marginBottom:-20}}
                            horizontal={true}>
                            {this.props.swiper}
                        </Swiper>
                    </View>
                )
            }else{
                return (
                    <View style={styles.content}>{this.props.swiper}</View>
                )
            }
        }else{
            return <Text></Text>
        }}
}
export default NewsSwiper;