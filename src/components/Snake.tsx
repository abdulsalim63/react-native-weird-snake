import { Fragment, useEffect, useState } from "react";
import { Coordinates, Direction } from "../types/types";
import { StyleSheet, View } from "react-native";
import { Colors } from "../styles/colors";
import Ionicons from "@react-native-vector-icons/ionicons";

interface SnakeFoodProps {
  snake: Coordinates[];
  food: Coordinates;
  size?: number;
  direction: Direction;
  score: number;
}

export default function SnakeFood({snake, food, size, direction, score}: SnakeFoodProps): React.JSX.Element {
  const snakeSize = size || 15;
  const foodSize = score != 0 && score % 50 === 0 ? 2 * (size || 15) : (size || 15);

  let snakeHeadRotation = '0deg';

  switch (direction) {
    case Direction.Up:
      snakeHeadRotation = '-90deg';
      break;
    case Direction.Down:
      snakeHeadRotation = '90deg';
      break;
    case Direction.Left:
      snakeHeadRotation = '180deg';
      break;
    case Direction.Right:
      snakeHeadRotation = '0deg';
      break;
  }

  const [showFood, setShowFood] = useState(true);

  useEffect(() => {
    setShowFood(false);
    const timeout = setTimeout(() => {
      setShowFood(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score]);

  return (
    <Fragment>
      <Ionicons name="airplane" 
        size={snakeSize} 
        color={Colors.primary} 
        style={{ width: snakeSize, 
        height: snakeSize, 
        position: 'absolute', 
        left: snake[0].x * snakeSize, 
        top: snake[0].y * snakeSize, 
        transform: [{ rotate: snakeHeadRotation }] }} />
      {snake.slice(1).map((segment, index) => {
        const segmentStyle = {
          width: snakeSize,
          height: snakeSize,
          left: segment.x * snakeSize,
          top: segment.y * snakeSize
        }
        return <View key={index} style={[styles.snake, segmentStyle]} />
      })}
      {showFood && (
        <Ionicons name="business" size={foodSize} color={Colors.tertiary} style={{ width: foodSize, height: foodSize, position: 'absolute', left: food.x * snakeSize, top: food.y * snakeSize }} />
      )}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  snake: {
    position: 'absolute',
    backgroundColor: Colors.primary,
  }
})