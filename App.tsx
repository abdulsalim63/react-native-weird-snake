import { GestureHandlerRootView } from "react-native-gesture-handler";
import Game from "./src/components/Game"

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Game />
    </GestureHandlerRootView>
  );
}

export default App