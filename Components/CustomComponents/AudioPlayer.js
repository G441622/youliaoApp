import React,{Component} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import WaveForm from 'react-native-audiowaveform';

export default class AudioPlayer extends Component{
    static defaultProps = {
        style:{},
        // waveFormStyle:{waveColor:'red',scrubColor:'white'},
        // autoPlay: false,
        // waveFormOnPress: ()=>{},
        // play: false,
        // stop: false
    }
    constructor(props){
        super(props)
        this.state = {
            style:{},
            waveFormStyle:{waveColor:'red',scrubColor:'blue'},
            autoPlay: false,
            waveFormOnPress: ()=>{console.log('waveFormOnPress')},
            play: false,
            stop: false
        }
    }
    componentWillUnmount() {
        this.setState({play:false,stop:false})
    }
    playOrPause = ()=>{
        this.setState({play:!this.state.play,stop:false})
    }
    stopAndReset = ()=>{
        this.setState({stop:true,play:false})
    }
    render(){
        let {waveFormStyle,autoPlay,waveFormOnPress,play,stop} = this.state;
        let {style,source,...other} = this.props;
        let playStatusText = play?"⏸":"▶️"
        let stopStatusText = "⏹"
        // console.log(other)
        return (
            <View {...other} style={[styles.contianer,style]}>
                <TouchableOpacity style={styles.button} onPress={this.playOrPause}><Text style={styles.text}>{playStatusText}</Text></TouchableOpacity>
                {/* <WaveForm 
                    style={styles.waveform}
                    waveFormStyle={waveFormStyle}
                    autoPlay={autoPlay} 
                    source={source}  
                    onPress={waveFormOnPress} 
                    play={play}
                    stop={stop}
                /> */}
                <TouchableOpacity style={[styles.button,{width:StyleSheet.hairlineWidth,margin:StyleSheet.hairlineWidth}]} onPress={this.stopAndReset}><Text style={styles.text}>{stopStatusText}</Text></TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contianer:{
        width:'100%',
        height:50,
        marginVertical:10,
        flexDirection:'row',
        alignItems:'center'
    },
    waveform:{
        flex:1,
        height:50,
        backgroundColor:'#aaa',
    },
    text:{
        fontSize:setFontSize(20)
    },
    button:{
        width:50,
        height:50,
        backgroundColor:'#aaa',
        borderRadius:8,
        marginHorizontal:8,
        justifyContent:'center',
        alignItems:'center'
    }
})