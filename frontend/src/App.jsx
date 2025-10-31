import React from "react";
import AuthWrapper from "./components/AuthWrapper";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "rgba(10, 30, 48, 0.3))",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
    <AuthWrapper />
    </div>
  );
}
export default App;