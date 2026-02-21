import { useContext, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { GameContext } from '../context/GameContext';

export default function ClickerObject() {
  const { setScore, updateTaskProgress } = useContext(GameContext);
  const doubleTapRef = useRef(null);

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

  return (
    <View style={styles.container}>
      <LongPressGestureHandler
        onHandlerStateChange={onLongPress}
        minDurationMs={3000} 
      >
        <View>
          <TapGestureHandler
            onHandlerStateChange={onDoubleTap}
            numberOfTaps={2}
            ref={doubleTapRef}
          >
            <View>
              <TapGestureHandler
                onHandlerStateChange={onSingleTap}
                waitFor={doubleTapRef}
              >
                <View style={styles.circle}>
                  <Image 
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1864/1864514.png' }} 
                    style={styles.catImage} 
                  />
                </View>
              </TapGestureHandler>
            </View>
          </TapGestureHandler>
        </View>
      </LongPressGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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