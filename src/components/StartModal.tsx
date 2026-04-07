import { View, Text, StyleSheet, Modal, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../styles/colors';

const StartModal = ({setGameStarted, setSpeed, setSize}: any) => {
  const [preGameSetting, setPreGameSetting] = React.useState(false);

  const handleLevelSelect = (level: string) => {
    switch (level) {
      case 'easy':
        // ✅ Set speed and size for easy level
        // width -2, height -8
        setSpeed(200);
        setSize(20);
        break;
      case 'medium':
        // ✅ Set speed and size for medium level
        // width -1, height -11
        setSpeed(120);
        setSize(15);
        break;
      case 'hard':
        // ✅ Set speed and size for easy level
        // width -2, height -16
        setSpeed(50);
        setSize(10);
        break;
    }
    setGameStarted(true);
  }

  return (
    <Modal transparent={true}>
      <View style={styles.modalOverlay}>
      <Text style={styles.startButtonText}>Weird Snake</Text>
      {!preGameSetting && <Button title="Start Game" onPress={() => {
        setPreGameSetting(true);
      }} />}
      {preGameSetting && 
        <View>
          <Text style={[styles.levelButtonText, {color: Colors.tertiary, textAlign: 'center',fontSize: 18}]}>Select Level</Text>
          <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelSelect('easy')}>
            <Text style={styles.levelButtonText}>Do you even game bruh?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelSelect('medium')}>
            <Text style={styles.levelButtonText}>Not Bad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelSelect('hard')}>
            <Text style={styles.levelButtonText}>FUCK YEAH!!!</Text>
          </TouchableOpacity>
        </View>
      }
      </View>
    </Modal>
  )
}

export default StartModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% opacity white background
  },
  startButton: {
    padding: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
  },
  startButtonText: {
    margin: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  levelButton: {
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    backgroundColor: 'rgba(11, 11, 11, 0.1)', // 50% opacity white background
  },
  levelButtonText: {
    margin: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 53, 74, 0.8)',
  },
})