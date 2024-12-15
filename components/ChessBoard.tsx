import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

interface Position {
  row: number;
  col: number;
}

const ChessBoard: React.FC = () => {
  const [horsePosition, setHorsePosition] = useState<Position>({ row: 6, col: 6 });
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]); // Store history of moves
  const squareSize = 60; // Size of each square on the chessboard
  const [timer, setTimer] = useState<number>(0); // Timer state
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false); // To control the timer

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1); // Increment timer every second
      }, 1000);
    } else {
      clearInterval(interval); // Clear the interval when timer is paused
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [isTimerActive]);

  const toggleTimer = () => {
    setIsTimerActive((prevState) => !prevState); // Toggle timer on/off
  };

  const handleSquarePress = (row: number, col: number): void => {
    // If the clicked square is a possible move, move the horse there
    if (possibleMoves.some((move) => move.row === row && move.col === col)) {
      setHorsePosition({ row, col });
      setPossibleMoves([]); // Clear possible moves after horse moves
      setMoveCount((prevCount) => prevCount + 1);

      // Update move history
      const move = `${String.fromCharCode(65 + col)}${8 - row}`;
      setMoveHistory((prevHistory) => [...prevHistory, move]); // Record the move
    } else if (horsePosition.row === row && horsePosition.col === col) {
      // If the clicked square is the current horse position, calculate possible moves
      const moves = calculatePossibleMoves(row, col);
      setPossibleMoves(moves);
    }
  };

  const calculatePossibleMoves = (row: number, col: number): Position[] => {
    const possibleMoves: Position[] = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
    ];

    // Filter out positions that are outside the board
    return possibleMoves.filter(
      (move) => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8
    );
  };

  const isSquareBlack = (row: number, col: number): boolean => {
    return (row + col) % 2 === 1; // Chessboard pattern: sum of row and col determines the color
  };

  const resetGame = () => {
    setHorsePosition({ row: 6, col: 6 });
    setMoveCount(0);
    setMoveHistory([]); // Clear the move history
    setTimer(0); // Reset the timer
    setIsTimerActive(false); // Pause the timer
  };

  const undoMove = () => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      const [col, row] = lastMove.split('');
      const prevRow = 8 - parseInt(row);
      const prevCol = col.charCodeAt(0) - 65;
      setHorsePosition({ row: prevRow, col: prevCol });
      setMoveHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
      setMoveCount((prevCount) => prevCount - 1);
    }
  };

  return (
    <View style={styles.board}>
      {/* Column Labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.columnLabel}>A</Text>
        <Text style={styles.columnLabel}>B</Text>
        <Text style={styles.columnLabel}>C</Text>
        <Text style={styles.columnLabel}>D</Text>
        <Text style={styles.columnLabel}>E</Text>
        <Text style={styles.columnLabel}>F</Text>
        <Text style={styles.columnLabel}>G</Text>
        <Text style={styles.columnLabel}>H</Text>
      </View>

      <View style={styles.grid}>
        {[...Array(8)].map((_, row) => (
          <View key={row} style={styles.row}>
            {/* Row Labels */}
            <Text style={styles.rowLabel}>{8 - row}</Text>
            
            {/* Squares */}
            {[...Array(8)].map((_, col) => {
              const isHorse = horsePosition.row === row && horsePosition.col === col;
              const isPossibleMove = possibleMoves.some(
                (move) => move.row === row && move.col === col
              );

              return (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.square,
                    {
                      width: squareSize,
                      height: squareSize,
                      backgroundColor: isPossibleMove
                        ? '#aaffaa' // Highlight possible moves in green
                        : isHorse
                        ? '#ffaa00' // Highlight current horse position in orange
                        : isSquareBlack(row, col)
                        ? '#444'
                        : '#fff', // Standard black and white chessboard colors
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                      elevation: 2, // Adding shadow for better appearance
                    },
                  ]}
                  onPress={() => handleSquarePress(row, col)}
                >
                  {isHorse && (
                    <Text style={styles.horse}>
                      🐴 {/* You can replace this emoji with a custom image */}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.moveCount}>Moves: {moveCount}</Text>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.history}>Move History: {moveHistory.join(' → ')}</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTimer}>
        <Text style={styles.toggleButtonText}>
          {isTimerActive ? 'Pause Timer' : 'Start Timer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.undoButton} onPress={undoMove}>
        <Text style={styles.undoButtonText}>Undo Move</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    marginTop: 20,
    backgroundColor: '#8B4513', // Brown background for the board
    padding: 10,
    borderRadius: 10, // Optional: to make edges rounded
    alignItems: 'center', // Center the board
    shadowColor: '#000', // Adding shadow for better appearance
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  columnLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  horse: {
    fontSize: 24, // Increased size for better visibility
    lineHeight: 24,
  },
  moveCount: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  history: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    color: '#fff',
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  undoButton: {
    backgroundColor: '#FFD700', // Gold color for undo button
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  undoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChessBoard;
