import { Chessboard } from "react-chessboard";
import './App.css';

function App() {
  return (
    <div style={{
      width: "calc(100vw - 120px)",        // Full viewport width minus the margin
      height: "calc(100vw - 120px)",       // Set height equal to width for square aspect minus the margin
      maxHeight: "calc(100vh - 120px)",    // Limit height to viewport height minus the margin
      maxWidth: "calc(100vh - 120px)",     // Limit width to viewport width minus the margin
      margin: "60px auto",                 // Center with equal margins on top/bottom and left/right
    }}>
        <Chessboard id="BasicBoard" style={{
            width: "100%",  // Fill the container width
            height: "100%", // Fill the container height
        }} />
    </div>
  );
}

export default App;
