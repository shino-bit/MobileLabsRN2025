import { useContext, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';
import { GameContext } from '../context/GameContext';

export default function ClickerObject() {
  const { setScore, updateTaskProgress } = useContext(GameContext);
  
  const doubleTapRef = useRef(null);

  const flingRightRef = useRef(null);
  const flingLeftRef = useRef(null);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onSingleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore(prev => prev + 1);
      updateTaskProgress('tap');
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore(prev => prev + 2);
      updateTaskProgress('doubleTap');
    }
  };

  const onLongPress = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScore(prev => prev + 10);
      updateTaskProgress('longPress');
    }
  };

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: true }
  );
  
  const onPanStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      updateTaskProgress('pan');
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    }
  };

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );
  
  const onPinchStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      updateTaskProgress('pinch');
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }
  };
  
  const onFlingRight = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      updateTaskProgress('flingRight');
    }
  };
  
  const onFlingLeft = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      updateTaskProgress('flingLeft');
    }
  };

  return (
    <View style={styles.container}>
      <FlingGestureHandler ref={flingRightRef} direction={Directions.RIGHT} onHandlerStateChange={onFlingRight}>
        <Animated.View>
          <FlingGestureHandler ref={flingLeftRef} direction={Directions.LEFT} onHandlerStateChange={onFlingLeft}>
            <Animated.View>
              <PinchGestureHandler onGestureEvent={onPinchGestureEvent} onHandlerStateChange={onPinchStateChange}>
                <Animated.View>
                  <PanGestureHandler 
                    simultaneousHandlers={[flingRightRef, flingLeftRef]}
                    onGestureEvent={onPanGestureEvent} 
                    onHandlerStateChange={onPanStateChange}
                  >
                    <Animated.View>
                      <LongPressGestureHandler onHandlerStateChange={onLongPress} minDurationMs={3000}>
                        <Animated.View>
                          <TapGestureHandler onHandlerStateChange={onDoubleTap} numberOfTaps={2} ref={doubleTapRef}>
                            <Animated.View>
                              <TapGestureHandler onHandlerStateChange={onSingleTap} waitFor={doubleTapRef}>
                                <Animated.View 
                                  style={[
                                    styles.circle, 
                                    { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }] }
                                  ]}
                                >
                                  <Image 
                                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' }} 
                                    style={styles.catImage} 
                                  />
                                </Animated.View>
                              </TapGestureHandler>
                            </Animated.View>
                          </TapGestureHandler>
                        </Animated.View>
                      </LongPressGestureHandler>
                    </Animated.View>
                  </PanGestureHandler>
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
          </FlingGestureHandler>
        </Animated.View>
      </FlingGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100, 
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  catImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
});