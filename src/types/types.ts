export interface GestureEventType {
  translationX: number;
  translationY: number;
}

export interface Coordinates {
  x: number;
  y: number;
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}