import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Animated,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ChinaRegionWheelPicker from 'rn-wheel-picker-china-region';
import CheckBox from '../CustomComponents/CheckBox';
const styles = StyleSheet.create({
    userContainer:{
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#f6f6f6',
        padding: 5,
        flexDirection:'row',
        alignItems:'center'
    },
    userText:{
        color:'#585858',
        fontSize:setFontSize(15),
        flex:1,
    },
    angleright:{
        color:'#ddd',
        fontSize:setFontSize(25)
    },
    text_input:{
        flex:1,
        textAlign:'right',
        paddingVertical:5,
    },
    checkboxes:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginVertical:8,
        backgroundColor:'white'
    },
    checkview:{
        justifyContent:'center',
        alignItems:'center',
    },
    checkbox:{
        width:60,
        marginLeft:8
    },
    modalStyle: {
        flex: 1,
        backgroundColor: '#0008',
        justifyContent:'center',
        alignItems:'center'
    },

});

class Writecheck extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            isPickerVisible:false,
            area:null,
            show:null,
            cid:1
        };
    }
    _onPress2Show=()=> {
        this.setState({ isPickerVisible: true });
    }
    _onPressCancel=()=> {
        this.setState({ isPickerVisible: false });
    }
    _onPressSubmit=(item)=> {
        this.setState({ isPickerVisible: false });
        this.setState({ area: `${item.item.category_name}` })
    }
    classifyshow=()=>{
        this.setState({ show: 1 });
    }
    natureshow=()=>{
        this.setState({ show: 2 });
    }
    industryshow=()=>{
        this.setState({ show: 3 });
    }
    directionshow=()=>{
        this.setState({ show: 4 });
    }
    onCategoryPress = (cid)=>{
        if (this.state.cid==cid) this.setState({cid:1})
        else this.setState({cid});
    }
    _renderItem=(item,index)=>{
        return (
            <TouchableOpacity style={{height:40,backgroundColor:'white',marginBottom:2,justifyContent:"center",alignItems:'center'}}
                              onPress={()=>this._onPressSubmit(item)}>
                <Text>{item.item.category_name}</Text>
            </TouchableOpacity>
        )

    }
    _renderCheckBoxes = ()=>{
        const categorys =[{category_name:'a',id:1,display:0},{category_name:'b',id:2,display:0},{category_name:'c',id:3,display:0},{category_name:'d',id:4,display:0}]
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
    render() {
        var data =[{category_name:'北京'},{category_name:'上海'},{category_name:'广州'}]
        return (<View style={{paddingVertical:10,backgroundColor:'white'}}>
                <TouchableOpacity style={styles.userContainer} onPress={this.classifyshow}>
                    <Text style={styles.userText}>  分类</Text>
                    <Icon  name={this.state.show==1?"angle-down":"angle-right"}style={styles.angleright}/>
                </TouchableOpacity>
                {this.state.show==1?this._renderCheckBoxes():<View></View>}
                {this.state.cid==4?<View><TouchableOpacity style={styles.userContainer} onPress={()=>this._onPress2Show()}>
                    <Text style={styles.userText}>  地区</Text>
                    <Text  style={styles.text_input}>{this.state.area||'点击选择地区'}</Text>
                </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.isPickerVisible}
                        onShow={() => { }}
                        onRequestClose={() => { }} >
                        <TouchableOpacity activeOpacity={1} style={styles.modalStyle} onPress={this._onPressCancel}>
                            <View style={{width:'40%',height:"60%",backgroundColor:'white'}}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => index}
                                    renderItem={this._renderItem}
                                    initialNumToRender={15}
                                    onEndReachedThreshold={0.1}
                                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ddd' }} />}
                                />
                            </View>

                        </TouchableOpacity>
                    </Modal>
                    <TouchableOpacity style={styles.userContainer} onPress={this.natureshow}>
                        <Text style={styles.userText}>  性质</Text>
                        <Icon name={this.state.show==2?"angle-down":"angle-right"}style={styles.angleright}/>
                    </TouchableOpacity>
                    {this.state.show==2?this._renderCheckBoxes():<View></View>}
                    <TouchableOpacity style={styles.userContainer} onPress={this.industryshow}>
                        <Text style={styles.userText}>  行业</Text>
                        <Icon name={this.state.show==3?"angle-down":"angle-right"}style={styles.angleright}/>
                    </TouchableOpacity>
                    {this.state.show==3?this._renderCheckBoxes():<View></View>}
                    <TouchableOpacity style={styles.userContainer} onPress={this.directionshow}>
                        <Text style={styles.userText}>  方向</Text>
                        <Icon  name={this.state.show==4?"angle-down":"angle-right"}style={styles.angleright}/>
                    </TouchableOpacity>
                    {this.state.show==4?this._renderCheckBoxes():<View></View>}</View>:<View></View>}

            </View>
        );
    }
}

export default Writecheck;