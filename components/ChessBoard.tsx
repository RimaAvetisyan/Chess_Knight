// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

// interface Position {
//   row: number;
//   col: number;
// }

// const ChessBoard: React.FC = () => {
//   const [horsePosition, setHorsePosition] = useState<Position>({ row: 6, col: 6 });
//   const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
//   const [moveCount, setMoveCount] = useState<number>(0);
//   const [moveHistory, setMoveHistory] = useState<string[]>(["G2"]); // Store history of moves
//   const squareSize = 60; // Size of each square on the chessboard
//   const [timer, setTimer] = useState<number>(0); // Timer state
//   const [isTimerActive, setIsTimerActive] = useState<boolean>(false); // To control the timer

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isTimerActive) {
//       interval = setInterval(() => {
//         setTimer((prevTime) => prevTime + 1); // Increment timer every second
//       }, 1000);
//     } else {
//       clearInterval(interval); // Clear the interval when timer is paused
//     }

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [isTimerActive]);

//   const toggleTimer = () => {
//     setIsTimerActive((prevState) => !prevState); // Toggle timer on/off
//   };

//   const handleSquarePress = (row: number, col: number): void => {
//     // If the clicked square is a possible move, move the horse there
//     if (possibleMoves.some((move) => move.row === row && move.col === col)) {
//       setHorsePosition({ row, col });
//       setPossibleMoves([]); // Clear possible moves after horse moves
//       setMoveCount((prevCount) => prevCount + 1);

//       // Update move history
//       const move = `${String.fromCharCode(65 + col)}${8 - row}`;
//       setMoveHistory((prevHistory) => [...prevHistory, move]); // Record the move
//     } else if (horsePosition.row === row && horsePosition.col === col) {
//       // If the clicked square is the current horse position, calculate possible moves
//       const moves = calculatePossibleMoves(row, col);
//       setPossibleMoves(moves);
//     }
//   };

//   const calculatePossibleMoves = (row: number, col: number): Position[] => {
//     const possibleMoves: Position[] = [
//       { row: row - 2, col: col - 1 },
//       { row: row - 2, col: col + 1 },
//       { row: row - 1, col: col - 2 },
//       { row: row - 1, col: col + 2 },
//       { row: row + 1, col: col - 2 },
//       { row: row + 1, col: col + 2 },
//       { row: row + 2, col: col - 1 },
//       { row: row + 2, col: col + 1 },
//     ];

//     // Filter out positions that are outside the board
//     return possibleMoves.filter(
//       (move) => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8
//     );
//   };

//   const isSquareBlack = (row: number, col: number): boolean => {
//     return (row + col) % 2 === 1; // Chessboard pattern: sum of row and col determines the color
//   };

//   const resetGame = () => {
//     setHorsePosition({ row: 6, col: 6 });
//     setMoveCount(0);
//     setMoveHistory([]); // Clear the move history
//     setTimer(0); // Reset the timer
//     setIsTimerActive(false); // Pause the timer
//   };

//   const undoMove = () => {
//     if (moveHistory.length > 1) { // Ensure at least one move exists to undo
//       const lastMove = moveHistory[moveHistory.length - 2]; // Get the previous move
//       console.log("Undoing move:", lastMove);
  
//       // Parse column and row from chess notation (e.g., 'G2')
//       const prevCol = lastMove.charCodeAt(0) - 65; // 'G' -> 6
//       const prevRow = 8 - parseInt(lastMove[1]);   // '2' -> 6
  
//       // Update state to reflect the undo
//       setHorsePosition({ row: prevRow, col: prevCol });
//       setMoveHistory((prevHistory) => prevHistory.slice(0, -1)); // Remove last move
//       setMoveCount((prevCount) => Math.max(0, prevCount - 1));   // Prevent negative count
//       setPossibleMoves([]); // Clear possible moves
//     } else {
//       console.log("No moves to undo");
//     }
//   };
  
  

//   return (
//     <View style={styles.board}>
//       {/* Column Labels */}
//       <View style={styles.labelsRow}>
//         <Text style={styles.columnLabel}>A</Text>
//         <Text style={styles.columnLabel}>B</Text>
//         <Text style={styles.columnLabel}>C</Text>
//         <Text style={styles.columnLabel}>D</Text>
//         <Text style={styles.columnLabel}>E</Text>
//         <Text style={styles.columnLabel}>F</Text>
//         <Text style={styles.columnLabel}>G</Text>
//         <Text style={styles.columnLabel}>H</Text>
//       </View>

//       <View style={styles.grid}>
//         {[...Array(8)].map((_, row) => (
//           <View key={row} style={styles.row}>
//             {/* Row Labels */}
//             <Text style={styles.rowLabel}>{8 - row}</Text>
            
//             {/* Squares */}
//             {[...Array(8)].map((_, col) => {
//               const isHorse = horsePosition.row === row && horsePosition.col === col;
//               const isPossibleMove = possibleMoves.some(
//                 (move) => move.row === row && move.col === col
//               );

//               return (
//                 <TouchableOpacity
//                   key={col}
//                   style={[
//                     styles.square,
//                     {
//                       width: squareSize,
//                       height: squareSize,
//                       backgroundColor: isPossibleMove
//                         ? '#aaffaa' // Highlight possible moves in green
//                         : isHorse
//                         ? '#ffaa00' // Highlight current horse position in orange
//                         : isSquareBlack(row, col)
//                         ? '#444'
//                         : '#fff', // Standard black and white chessboard colors
//                       shadowColor: '#000',
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: 0.3,
//                       shadowRadius: 3,
//                       elevation: 2, // Adding shadow for better appearance
//                     },
//                   ]}
//                   onPress={() => handleSquarePress(row, col)}
//                 >
//                   {isHorse && (
//                     <Text style={styles.horse}>
//                       🐴 {/* You can replace this emoji with a custom image */}
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>

//       <Text style={styles.moveCount}>Moves: {moveCount}</Text>
//       <Text style={styles.timer}>Time: {timer}s</Text>
//       <Text style={styles.history}>Move History: {moveHistory.join(' → ')}</Text>

//       <TouchableOpacity style={styles.toggleButton} onPress={toggleTimer}>
//         <Text style={styles.toggleButtonText}>
//           {isTimerActive ? 'Pause Timer' : 'Start Timer'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.undoButton} onPress={undoMove}>
//         <Text style={styles.undoButtonText}>Undo Move</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
//         <Text style={styles.resetButtonText}>Reset Game</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   board: {
//     flexDirection: 'column',
//     marginTop: 20,
//     backgroundColor: '#8B4513', // Brown background for the board
//     padding: 10,
//     borderRadius: 10, // Optional: to make edges rounded
//     alignItems: 'center', // Center the board
//     shadowColor: '#000', // Adding shadow for better appearance
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 8, // For Android shadow
//   },
//   labelsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 5,
//     paddingHorizontal: 5,
//   },
//   columnLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//     marginHorizontal: 10,
//   },
//   grid: {
//     flexDirection: 'column',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rowLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginRight: 10,
//   },
//   square: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#000',
//   },
//   horse: {
//     fontSize: 24, // Increased size for better visibility
//     lineHeight: 24,
//   },
//   moveCount: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   timer: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   history: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 10,
//     fontStyle: 'italic',
//     color: '#fff',
//   },
//   toggleButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     marginTop: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   toggleButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   undoButton: {
//     backgroundColor: '#FFD700', // Gold color for undo button
//     padding: 10,
//     marginTop: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   undoButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   resetButton: {
//     backgroundColor: '#FF5733',
//     padding: 10,
//     marginTop: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   resetButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ChessBoard;

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, StyleSheet, Modal, Dimensions } from 'react-native';

interface Position {
  row: number;
  col: number;
}

const ChessBoard: React.FC = () => {
  const [horsePosition, setHorsePosition] = useState<Position | null>(null); // Horse position, starts null
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Popup visibility
  const [inputPosition, setInputPosition] = useState<string>(''); // Input value for the popup
  const squareSize = 60; // Size of each square on the chessboard

  const handleSquarePress = (row: number, col: number): void => {
    if (horsePosition && horsePosition.row === row && horsePosition.col === col) {
      // If the clicked square is the current horse position, calculate possible moves
      const moves = calculatePossibleMoves(row, col);
      setPossibleMoves(moves);
    } else if (possibleMoves.some((move) => move.row === row && move.col === col)) {
      // Move horse to the new position if it's a valid move
      setHorsePosition({ row, col });
      setPossibleMoves([]); // Clear possible moves
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

    return possibleMoves.filter(
      (move) => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8
    );
  };

  const isSquareBlack = (row: number, col: number): boolean => {
    return (row + col) % 2 === 1;
  };
  
  const handleSetHorsePosition = () => {
    // Convert input to uppercase to handle both lowercase and uppercase letters
    const upperInput = inputPosition.toUpperCase();
  
    // Convert input (e.g., "C6") to row and col
    const col = upperInput.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
    const row = 8 - parseInt(upperInput[1]); // '8' -> 0, '7' -> 1, etc.
  
    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
      setHorsePosition({ row, col }); // Set the horse's position
      setPossibleMoves([]); // Clear possible moves
      setModalVisible(false); // Close the popup
      setInputPosition(''); // Clear the input
    } else {
      alert('Invalid position! Please enter a valid position (e.g., "C6").');
    }
  };

  return (
    <View style={styles.board}>
      <View style={styles.grid}>
        {[...Array(8)].map((_, row) => (
          <View key={row} style={styles.row}>
            {[...Array(8)].map((_, col) => {
              const isHorse = horsePosition && horsePosition.row === row && horsePosition.col === col;
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
                        ? '#aaffaa'
                        : isHorse
                        ? '#ffaa00'
                        : isSquareBlack(row, col)
                        ? '#444'
                        : '#fff',
                    },
                  ]}
                  onPress={() => handleSquarePress(row, col)}
                >
                  {isHorse && (
                    <Text style={styles.horse}>
                      🐴
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.popupButton}
        onPress={() => setModalVisible(true)} // Open the popup
      >
        <Text style={styles.popupButtonText}>Set Horse Position</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Close the popup
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Position (e.g., C6)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter position"
              value={inputPosition}
              onChangeText={setInputPosition}
              autoCapitalize="characters" // Automatically capitalize letters
            />
            <TouchableOpacity
              style={styles.setButton}
              onPress={handleSetHorsePosition}
            >
              <Text style={styles.setButtonText}>Set Position</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    marginTop: 20,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  horse: {
    fontSize: 24,
  },
  popupButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 10,
  },
  setButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  setButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChessBoard;
