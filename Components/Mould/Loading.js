import React from 'react';
import { StyleSheet, Text, View, Platform,TextInput,ScrollView ,Image,TouchableOpacity,Animated,Easing} from 'react-native';
import Images from '../../imagesRequired';


const styles = StyleSheet.create({
    demo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginTop:5,
    },
    text: {
        fontSize:setFontSize(10),
        textAlign: 'center',
    }

});
class Loading extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
            rotation: new Animated.Value(0),// 透明度初始值设为0
            fontSize: new Animated.Value(0)
        };
    }
    componentDidMount() {
        this.state.rotation.setValue(0);
        Animated.parallel(['fadeAnim', 'rotation', 'fontSize'].map(property => {
            return Animated.timing(this.state[property], {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
            });
        })).start(() => this.componentDidMount());
    }
    render(){
        return (<View>
                <Animated.View style={[ styles.demo,{
                    opacity: this.state.fadeAnim,
                    transform: [{
                        rotateZ: this.state.rotation.interpolate({
                            inputRange: [0,1],
                            outputRange: ['0deg', '360deg']
                        })
                    }]
                }]}><Image source={Images.load} style={{width:25,height:25}}/></Animated.View>
                <Text style={styles.text}>正在加载</Text>
            </View>


        );
    }
}

export default Loading;
