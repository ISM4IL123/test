import React, { useState } from "react";
import "./LoginForm";

export default function SignupForm({ onSwitch }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsError(false);
                setMessage(data.message);
                setName("");
                setEmail("");
                setPassword("");
                // Optionally switch to login after 2 seconds
                setTimeout(() => {
                    onSwitch();
                }, 2000);
            } else {
                setIsError(true);
                setMessage(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            setIsError(true);
            setMessage("Unable to connect to server. Please try again later.");
        }
    };
    const getMessageStyle = () => {
        if (!isError) {
            // GREEN - Success
            return {
                backgroundColor: "#e8f5e9",
                color: "#2e7d32",
                border: "2px solid #66bb6a"
            };
        } else if (isError === "orange") {
            // ORANGE - HTTP Error
            return {
                backgroundColor: "#fff3e0",
                color: "#e65100",
                border: "2px solid #ff9800"
            };
        } else if (isError === "purple") {
            // PURPLE - Backend Error
            return {
                backgroundColor: "#f3e5f5",
                color: "#6a1b9a",
                border: "2px solid #9c27b0"
            };
        } else if (isError === "yellow") {
            // YELLOW - Unknown Error
            return {
                backgroundColor: "#fffde7",
                color: "#f57f17",
                border: "2px solid #ffeb3b"
            };
        } else {
            // RED - Network Error
            return {
                backgroundColor: "#ffebee",
                color: "#c62828",
                border: "2px solid #ef5350"
            };
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign up</h2>
            {message && (
                <div style={{
                    padding: "10px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    textAlign: "center",
                    fontWeight: "bold",
                    ...getMessageStyle()
                }}>
                    {message}
                </div>
            )}
            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
            />
            <button type="submit" className="form-submit">Create Account</button>
            <p>
                Already have an account?{" "}
                <span className="form-submit-text" onClick={onSwitch}>
                    Login
                </span>
            </p>
        </form>
    );
}