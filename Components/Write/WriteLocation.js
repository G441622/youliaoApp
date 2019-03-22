import AMapLocation from 'react-native-smart-amap-location'
import AMap from 'react-native-smart-amap'
import { Text, View, NativeAppEventEmitter, Platform, Dimensions, Alert, TouchableOpacity, FlatList} from 'react-native';
import React,{Component} from 'react';
import SubHeader from '../Mould/SubHeader';


const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window')


export default class WriteLocation extends Component {
    static navigationOptions = ({navigation})=>{
        return {
            header : <SubHeader navigation={navigation} title='位置' />
        }
    }
    constructor(props){
        super(props)
        this._amap = null
        this._page = 0
        this._coordinate = {latitude:31.37823,longitude:121.496276}
        this._keywords = '商务住宅|学校'
        this._onDidMoveByUserTimer = null
        this.state = {
            coordinate:{latitude:31.37823,longitude:121.496276},
            poi:[]
        }
    }

    componentDidMount() {
        AMapLocation.init(null) //使用默认定位配置
        NativeAppEventEmitter.addListener('amap.location.onLocationResult', this._onLocationResult)
        NativeAppEventEmitter.addListener('amap.onPOISearchDone', this._onPOISearchDone)
        NativeAppEventEmitter.addListener('amap.onPOISearchFailed', this._onPOISearchFailed)
        // AMapLocation.startUpdatingLocation()
        AMapLocation.getReGeocode()
    }
    componentWillUnmount () {
        //停止并销毁定位服务
        AMapLocation.cleanUp()
        // AMapLocation.stopUpdatingLocation()
    }

    _setLocation = (location)=>{
        try {
            let {params} = this.props.navigation.state
            params.setLocation(location.name);
            this.props.navigation.goBack()
        } catch (error) {
            
        }
        // this.props.setLocation(location.name)
    }
    _onLocationResult = (result) => {
        if(result.error) {
            // Alert.alert(`错误代码: ${result.error.code}`, `错误信息: ${result.error.localizedDescription}`)
        }else {
            if(result.formattedAddress) {
                // Alert.alert(`格式化地址 = ${result.formattedAddress}`)
                var poi = this.state.poi;
                poi[0] = {name:result.formattedAddress};
                this.setState({poi})
            }else {
                // Alert.alert(`latitude = ${result.coordinate.latitude}`, `longitude = ${result.coordinate.longitude}`)
            }
            this._coordinate = result.coordinate;
            try {
                this.setState({coordinate:result.coordinate})
                this._amap.setOptions({
                    zoomLevel: 18.1,
                })
                this._amap.setCenterCoordinate(result.coordinate)
                this._amap.searchPoiByCenterCoordinate({
                    page: 1,//(this._page = 1),
                    coordinate: result.coordinate,
                    keywords: this._keywords,
                    offset:1000,
                    radius:1000
                })
            } catch (error) {
                console.log('_onLocationResult catched : ',error)
            }
        }
    }

    //单次定位并返回逆地理编码信息
    _showReGeocode = () => {
        AMapLocation.getReGeocode()
    }

    //单次定位并返回地理编码信息
    _showLocation = () => {
        AMapLocation.getLocation()
    }
    _renderAMap = ()=>{
        return (
            <AMap
                ref={ component => this._amap = component }
                style={{width:deviceWidth,height:deviceHeight * 0.5}}
                options={{
                    frame: {
                        width: deviceWidth,
                        height: deviceHeight * 0.5
                    },
                    showsUserLocation: true,
                    userTrackingMode: Platform.OS == 'ios' ? AMap.constants.userTrackingMode.follow : null,
                    centerCoordinate: this.state.coordinate,
                    zoomLevel: 18.1,
                    centerMarker: Platform.OS == 'ios' ? 'icon_location' : 'poi_marker',
                }}
                onLayout={this._onLayout}
                onDidMoveByUser={this._onDidMoveByUser}
            />
        )
    }
    _renderList = ()=>{
        return (
            <FlatList
                data={this.state.poi}
                style={{width:deviceWidth}}
                // ListHeaderComponent={this._renderAMap()}
                renderItem={({item}) =>{
                    return (
                        <TouchableOpacity style={{width:deviceWidth,height:40,paddingLeft:20,justifyContent:'center',alignItems:'flex-start',backgroundColor:'white',borderColor:'#eee',borderWidth:1,borderBottomWidth:0}} activeOpacity={1} onPress={()=>this._setLocation(item)}>
                            <Text style={{width:deviceWidth}}>{item.name}</Text>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
    render () {
        //console.log(`amap-alone render...`)
        return (
                <View style={{ flex: 1 }}>
                    {this._renderAMap()}
                    {this._renderList()}
                </View>
        )
    }

    _onDidMoveByUser = (e) => {
        // console.log(`_onDidMoveByUser....`)
    }


    // _onPOISearchFailed = (e) => {
    //    //console.log(`_onPOISearchFailed...`)
    //    //console.log(e)
    //    //console.log(e.error)
    //    this._page--;
    // }

    _onPOISearchDone = (result) => {
        // console.log('_onPOISearchDone : ',result)
        var poi = this.state.poi;
        if (poi.length) poi = [poi[0]]
        poi = [...poi,...result.searchResultList]
        this.setState({poi})
        if(Platform.OS == 'ios') {
            this._endSearch(result)
        }else {
            setTimeout( () => {
                this._endSearch(result)
            }, 255)
        }
    }

    _endSearch = (result) => {
        let { searchResultList, error } = result
        console.log(result.error)
        if(error) {
            return console.log('endSearch error')
        }
        // console.log(`this._page = ${this._page}`)
    }

}