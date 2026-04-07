import { Fragment } from "react";
import { Coordinates } from "../types/types";
import { StyleSheet, View } from "react-native";
import { Colors } from "../styles/colors";
import Ionicons from "@react-native-vector-icons/ionicons";

interface SnakeFoodProps {
  snake: Coordinates[];
  food: Coordinates;
  size?: number;
}

export default function SnakeFood({snake, food, size}: SnakeFoodProps): React.JSX.Element {
  const snakeSize = size || 15;
  return (
    <Fragment>
      <Ionicons name="airplane" size={snakeSize} color={Colors.primary} style={{ width: snakeSize, height: snakeSize, position: 'absolute', left: snake[0].x * snakeSize, top: snake[0].y * snakeSize }} />
      {snake.slice(1).map((segment, index) => {
        const segmentStyle = {
          width: snakeSize,
          height: snakeSize,
          left: segment.x * snakeSize,
          top: segment.y * snakeSize
        }
        return <View key={index} style={[styles.snake, segmentStyle]} />
      })}
      <Ionicons name="business" size={snakeSize} color={Colors.tertiary} style={{ width: snakeSize, height: snakeSize, position: 'absolute', left: food.x * snakeSize, top: food.y * snakeSize }} />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  snake: {
    position: 'absolute',
    backgroundColor: Colors.primary,
  }
})