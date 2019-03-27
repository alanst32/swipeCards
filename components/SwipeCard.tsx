import React from 'react';
import { View, Text, StyleSheet, Platform, PanResponder, Animated, Dimensions  } from 'react-native';
import Icon form 'react-native-vector-icons/Ionicons';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').width;

const Users = [
    {id: '1', uri: require('./imgs/1.jpg')},
    {id: '2', uri: require('./imgs/2.jpg')},
    {id: '3', uri: require('./imgs/3.jpg')},
    {id: '4', uri: require('./imgs/4.jpg')},
    {id: '5', uri: require('./imgs/5.jpg')},
    {id: '6', uri: require('./imgs/6.jpg')}
]

export default class SwipeCard extends React.Component{
    constructor() {
        super();

        this.position = new Animated.ValueXY();
        this.state = {
            currentIndex: 0
        }
        this.rotate = this.position.x.interpolate({
            inputRange: [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            outputRange: ['-10deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        });
        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
                ...this.position.getTranslateTransform()
            ]
        }
        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        })
        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        })
        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-DEVICE_WIDTH / 2, 0, DEVICE_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        })
    }

    componentWillMount() {
        this.PanResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {
                if(gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: {
                            x: DEVICE_WIDTH + 100,
                            y: gestureState.dy
                        }
                    }).start( () => {
                        this.setState(
                            {currentIndex: this.state.currentIndex +1},
                            () => {
                                this.position.setValue({x: 0, y: 0})
                            }
                        )
                    });
                } else if (gestureState.dx < 120) {
                    Animated.spring(this.position, {
                        toValue: {
                            x: DEVICE_WIDTH - 100,
                            y: gestureState.dy
                        }
                    }).start( () => {
                        this.setState(
                            {currentIndex: this.state.currentIndex +1},
                            () => {
                                this.position.setValue({x: 0, y: 0})
                            }
                        )
                    });
                } else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start();
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
            }
        });
    }

    renderUsers = () => {
        return Users.map((item, i) => {
            if (i < this.state.currentIndex) {
                return null;
            } else if (i === this.state.currentIndex) {
                return (
                    <Animated.View {...this.PanResponder.panHandlers}
                                   key={item.id}
                                   style={[
                                       this.rotateAndTranslate,
                                       {height: DEVICE_HEIGHT - 120, width: DEVICE_WIDTH, padding: 10, position: 'absolute'}
                                   ]}>
                        <Animated.View style={{
                            opacity: this.likeOpacity,
                            transform: [{ rotate: '-30deg' }],
                            position: 'absolute',
                            top: 50,
                            left: 40,
                            zIndex: 1000}}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                                LIKE
                            </Text>
                        </Animated.View>
                        <Animated.View style={{
                            opacity: this.dislikeOpacity,
                            transform: [{ rotate: '30deg' }],
                            position: 'absolute',
                            top: 50,
                            right: 40,
                            zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>
                                NOPE
                            </Text>
                        </Animated.View>
                        <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
                               source={item.url}/>
                    </Animated.View>
                );
            } else {
                <Animated.View key={item.id}
                               style={[{
                                   opacity: this.nextCardOpacity,
                                   transform: [{ scale: this.nextCardScale }],
                                   height: DEVICE_HEIGHT - 120, width: DEVICE_WIDTH, padding: 10, position: 'absolute'
                                }]}>
                    <Animated.View style={{
                        opacity: 0,
                        transform: [{ rotate: '-30deg' }],
                        position: 'absolute',
                        top: 50,
                        left: 40,
                        zIndex: 1000}}>
                        <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                            LIKE
                        </Text>
                    </Animated.View>
                    <Animated.View style={{
                        opacity: 0,
                        transform: [{ rotate: '30deg' }],
                        position: 'absolute',
                        top: 50,
                        right: 40,
                        zIndex: 1000 }}>
                        <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>
                            NOPE
                        </Text>
                    </Animated.View>
                    <Image style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                           source={item.uri} />
                </Animated.View>
            }
            return(
                <Animated.View {...this.PanResponder.panHandlers}
                               key={item.id}
                               style={[
                                   {transform: this.position.getTranslateTransform()},
                                   {height: DEVICE_HEIGHT - 120, width: DEVICE_WIDTH, padding: 10, position: 'absolute'}
                               ]}>
                    <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20}}
                           source={item.url}/>

                </Animated.View>
            )
        }).reverse()
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{height: 60}}>
                </View>
                <View style={{flex: 1}}>
                    {this.renderUsers()}
                </View>
                <View style={{height: 60}}>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})