/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Dimensions
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';

let { width, height } = Dimensions.get('window');
const SCREEN_HEIGHT =  height;
const SCREEN_WIDTH  = width ;
const ASPECT_RATIO = width / height;
const LATITUDE = 59.32932349999999;
const LONGITUDE = 18.068580800000063;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  constructor(props) {
    super(props)
    this.state = {
      coords: [],
      source: '',
      destination: '',
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },      
      markerPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE
      }
    }
  }

  componentDidMount() {
    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example
    //this.getDirections("40.1884979, 29.061018", "41.0082,28.9784")
    //this.getDirections("Bhavnagar", "Pune")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        var initialRegion = {
            latitude: lat,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({ region: initialRegion})
        this.setState({ markerPosition: initialRegion})
      },
    (error) => console.log(error.message),
    //(error) => alert(JSON.stringify(error)),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );

  }
  

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  
  async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
        //let resp = await fetch(`https://api.dastardly26.hasura-app.io/directions?origin=Bhavnagar&destination=Ahmedabad`)
        //let resp = await fetch(`https://api.dastardly26.hasura-app.io/directions?origin=Bhavnagar&destination=Ahmedabad&departure_time=now`)
        
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        this.setState({coords: coords})
        return coords
    } catch(error) {
        alert(error)
        return error
    }
}

direction = () => {
  //alert('test')
  //alert(this.state.source)
  //this.props.navigation.navigate('Profile');
  // sanitize the input over here before call the direction api's. 
  let source = this.state.source;
  let destination =  this.state.destination;

  //this.getDirections("Bhavnagar", "Pune")
  //this.getDirections("Bhavnagar", "Delhi")
  //this.getDirections(String(this.state.source), String(this.state.destination))
  this.getDirections(source, destination)

   
}

  render() {
    return (
      <View style={styles.containerWorking}>
        <MapView style={styles.map}
         region={ this.state.region }
        >
          <MapView.Marker
          coordinate={ this.state.markerPosition }
            title={'My place'}
            description={'I am here now'}
          />

          <MapView.Polyline 
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red"/>

          

        </MapView>
        <TextInput 
               style={styles.textInput}  
               placeholder="start location"
               placeholderTextColor='rgba(255,0,255,0.7)'
               onChangeText={ (source) => this.setState({source}) }
               underlineColorAndroid = 'transparent'
               returnKeyType="next"
               keyboardType="email-address"
               autoCapitalize="none"
               autoCorrect={false}                 
           />
        <TextInput 
           style={styles.textInput}  
           placeholder="Destination location"
           placeholderTextColor='rgba(255,0,255,0.7)'
           onChangeText={ (destination) => this.setState({destination}) }
           underlineColorAndroid = 'transparent'
           returnKeyType="go"
           keyboardType="email-address"
           autoCapitalize="none"
           autoCorrect={false}                 
       />
       <TouchableOpacity style={styles.btn} onPress = {this.direction} >
               <Text>Direction</Text>
        </TouchableOpacity>   
    
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  containerWorking: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  radius: {
    height: 50,
    height: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  marker: {
    height: 20,
    height: 20,
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white'
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,    
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  btn: {
    alignSelf: 'stretch',
    padding: 20,    
    backgroundColor: '#01c853',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
