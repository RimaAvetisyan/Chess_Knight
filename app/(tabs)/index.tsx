import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ChessBoard from '@/components/ChessBoard';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chess Knight Moves</Text> {/* Title */}
      <ChessBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color for the screen
    padding: 20, // Padding around the content
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, // Space between title and chessboard
  },
});

export default App;
