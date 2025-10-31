import React, {useState} from "react";
import "./form.css"

export default function LoginForm({onSwitch}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setIsError(false);
                setMessage(`${data.message} Welcome, ${data.user.name}!`);
                // Store token in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                // Clear form
                setEmail("");
                setPassword("");
            } else {
                setIsError(true);
                setMessage(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            setIsError(true);
            setMessage("Unable to connect to server. Please try again later.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {message && (
                <div style={{
                    padding: "10px",
                    marginBottom: "15px",
                    borderRadius: "5px",
                    backgroundColor: isError ? "#ffebee" : "#e8f5e9",
                    color: isError ? "#c62828" : "#2e7d32",
                    border: `1px solid ${isError ? "#ef5350" : "#66bb6a"}`,
                    textAlign: "center",
                    fontWeight: "bold"
                }}>
                    {message}
                </div>
            )}
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
            <button type="submit" className="form-submit">Login</button>
            <p>
                Don't have an account?{" "}
                <span className="form-submit-text" onClick={onSwitch}>
                    Sign up
                </span>
            </p>
        </form>

    );
}