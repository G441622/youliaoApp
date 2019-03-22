import React from 'react';
import { StyleSheet, Text, View, AppRegistry,TextInput,ScrollView ,Image,TouchableOpacity,Modal,Animated,FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
    userContainer:{
        flex:1,
        paddingVertical: 5,
        flexDirection:'row',
        /*alignItems:'center'*/
    },
    userText:{
        color:'#585858',
        fontSize:setFontSize(15),
    },
    text_input:{
        flex:1,
        textAlign:'left',
    },
    modalStyle: {
        flex: 1,
        backgroundColor: '#0008',
        justifyContent:'center',
        alignItems:'center'
    },

});

class ForumCheck extends React.Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            isPickerVisible:false,
            area:null,
            nature:null,
            industry:null,
            direction:null,

        };
    }
    _onPressShow=()=> {
        this.setState({ isPickerVisible: true });
    }
    _onPressCancel=()=> {
        this.setState({ isPickerVisible: false });
    }
    _onPressSubmit=(item)=> {
        this.setState({ isPickerVisible: false,area: item.category_name });
    }
    _renderItem=({item,index})=>{
        return (
            <TouchableOpacity style={{height:40,backgroundColor:'white',marginBottom:2,justifyContent:"center",alignItems:'center'}}
                              onPress={()=>this._onPressSubmit(item)}>
                <Text>{item.category_name}</Text>
            </TouchableOpacity>
        )

    }
    render() {
        var data =[{category_name:'北京'},{category_name:'上海'},{category_name:'广州'}]
        return (<View style={{paddingVertical:5,backgroundColor:'#fcfcfc',flexDirection:'row',paddingHorizontal:20,borderTopColor:'#ddd',borderTopWidth:1,borderBottomColor:'#ddd',borderBottomWidth:1}}>
                <TouchableOpacity style={styles.userContainer} onPress={()=>this._onPressShow()}>
                    <Text style={styles.userText}>地区:</Text>
                    <Text  style={styles.text_input}> {this.state.area||'上海'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userContainer} onPress={()=>this._onPressShow()}>
                    <Text style={styles.userText}>性质:</Text>
                    <Text  style={styles.text_input}> {this.state.nature||'股票'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userContainer} onPress={()=>this._onPressShow()}>
                    <Text style={styles.userText}>行业:</Text>
                    <Text  style={styles.text_input}> {this.state.industry||'金融'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.userContainer} onPress={()=>this._onPressShow()}>
                    <Text style={styles.userText}>方向:</Text>
                    <Text  style={styles.text_input}> {this.state.direction||'融资'}</Text>
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
            </View>
        );
    }
}

export default ForumCheck;