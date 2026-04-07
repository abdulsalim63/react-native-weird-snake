import * as React from 'react';
import { StyleSheet, View, Button, Text, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../styles/colors';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Coordinates, Direction } from '../types/types';
import Snake from './Snake';
import StartModal from './StartModal';

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 20 }, { x: 4, y: 20 }, { x: 3, y: 20 }];
const DEFAULT_MOVE_INTERVAL = 150; // milliseconds
const DEFAULT_SIZE = 20;

export default function Game(): React.JSX.Element {
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  const [size, setSize] = React.useState(DEFAULT_SIZE);
  const [speed, setSpeed] = React.useState(DEFAULT_MOVE_INTERVAL);

  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snakePosition, setSnakePosition] = React.useState<Coordinates[]>(SNAKE_INITIAL_POSITION);
  const [foodPosition, setFoodPosition] = React.useState<Coordinates>({
    x: Math.floor(Math.random() * 10),
    y: Math.floor(Math.random() * 10)
  });

  const [score, setScore] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [bombVisible, setBombVisible] = React.useState(false);
  const [gameBounds, setGameBounds] = React.useState({ width: 0, height: 0 });
  const gameBoundsRef = React.useRef(gameBounds); // ✅ add this

  // Keep ref in sync
  React.useEffect(() => {
    gameBoundsRef.current = gameBounds;
  }, [gameBounds]);

  const moveSnake = () => {
    setSnakePosition(prev => {
      const head = prev[0];
      let newHead: Coordinates;

      switch (direction) {
        case Direction.Up:
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case Direction.Down:
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case Direction.Left:
          newHead = { x: head.x - 1, y: head.y };
          break;
        case Direction.Right:
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (newHead.x < 0) {
        newHead.x = Math.floor(gameBoundsRef.current.width / size - 1);
      } else if (newHead.x > gameBoundsRef.current.width / size - 1) {
        console.log('hit 1');
        newHead.x = 0;
      }

      if (newHead.y < 0) {
        newHead.y = Math.floor(gameBoundsRef.current.height / size - 16);
      } else if (newHead.y > gameBoundsRef.current.height / size - 16) {
        console.log('hit 2');
        newHead.y = 0;
      }

      if (prev.length > 4 && prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prev;
      }

      console.log(`New head position: (${newHead.x}, ${newHead.y})`);
      if (Math.floor(newHead.x) == foodPosition.x && Math.floor(newHead.y) == foodPosition.y) {
        console.log('Food eaten!');

        if (direction === Direction.Right) {
          showPopup();
        }

        setScore(prev => prev + 10)
        setFoodPosition(getRandomFoodPosition);
        console.log('New food position: ', foodPosition);
        return [newHead, ...prev];
      }
      
      const newSnake = [newHead, ...prev.slice(0, -1)];
      return newSnake;
    });
  }

  const panGesture = Gesture.Pan()
    .onStart((e) => console.log('Pan started '))
    .onEnd((e) => {
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        if (e.translationX > 0 && direction !== Direction.Left) {
          setDirection(Direction.Right);
          console.log('Moving to the right');
        } else if (direction !== Direction.Right) {
          setDirection(Direction.Left);
          console.log('Moving to the left');
        }
        else {console.log('Invalid horizontal move')}
      } else {
        if (e.translationY > 0 && direction !== Direction.Up) {
          setDirection(Direction.Down);
          console.log('Moving downwards');
        } else if (direction !== Direction.Down) {
          setDirection(Direction.Up);
          console.log('Moving upwards');
        }
        else {console.log('Invalid vertical move')}
      }
      setIsPaused(false);
    });

  const showPopup = () => {
      setBombVisible(true);
      // Auto close after 500ms
      setTimeout(() => {
        setBombVisible(false);
      }, 500);
    };
  
  const getRandomFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * gameBoundsRef.current.width / size),
      y: Math.floor(Math.random() * gameBoundsRef.current.height / size)
    }
  }

  React.useEffect(() => {
    console.log('Food position: ', foodPosition);
    const interval = setInterval(() => {
      if (!isPaused && !isGameOver && isGameStarted) {
        moveSnake();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [direction, isPaused, isGameOver, isGameStarted, size, speed]);

  React.useEffect(() => {
  }, [size, speed]);

  return (
    <GestureDetector gesture={panGesture}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']} 
        onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setGameBounds({ width, height });
        console.log('Bounds:', width, height); // check actual size
      }}>
        <View style={styles.buttonContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          {isGameOver && 
            <Modal transparent={true}>
              <View style={styles.modalOverlay}>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Button title="Restart" onPress={() => {
                setSnakePosition(SNAKE_INITIAL_POSITION);
                setDirection(Direction.Right);
                setFoodPosition(getRandomFoodPosition);
                setScore(0);
                setIsGameOver(false);
              }} />
              </View>
            </Modal>}
          <Button title={isPaused ? "Resume" : "Pause"} onPress={() => setIsPaused(prev => !prev)} />
          <Button title="Reset" onPress={() => {
            setSnakePosition(SNAKE_INITIAL_POSITION);
            setDirection(Direction.Right);
            setFoodPosition(getRandomFoodPosition);
            setScore(0);
          }} />
          <Button title="Exit" onPress={() => {
            setIsGameStarted(false);
            setSnakePosition(SNAKE_INITIAL_POSITION);
            setDirection(Direction.Right);
            setFoodPosition(getRandomFoodPosition);
            setScore(0);
          }} />
        </View>
        <View style={styles.boundaries}>
          {isGameStarted && <Snake snake={snakePosition} food={foodPosition} size={size} />}
          {!isGameStarted && <StartModal setGameStarted={setIsGameStarted} setSpeed={setSpeed} setSize={setSize} />}
        </View>
        <Modal transparent={true} visible={bombVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <Image source={require('../../assets/bomb.png')} style={{ width: 400, height: 400 }} />
          </View>
        </Modal>
      </SafeAreaView>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  }, 
  boundaries:{
    flex: 1,
    maxWidth: "auto",
    maxHeight: "auto",
    alignSelf: "auto",
    borderColor: Colors.primary,
    borderWidth: 10,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.tertiary,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.tertiary,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% opacity black background
  },
})