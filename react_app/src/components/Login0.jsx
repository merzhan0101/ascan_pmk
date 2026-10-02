import { useState } from "react";
import "./Login.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                onLogin();
            } else {
                alert(data.message || "Ошибка авторизации");
            }
        } catch (error) {
            alert("Ошибка соединения с сервером");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="login-form">
            <img src="logo-01.png"></img>
            <h2 className="login-title">Авторизация</h2>
            <p style={{ marginTop: -20 }}>Для начала пройдите авторизацию</p>

            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
            />

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
            />

            <button type="submit" className="login-button">
                Войти в учетную запись
            </button>

            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </form>
    );
};

export default Login;