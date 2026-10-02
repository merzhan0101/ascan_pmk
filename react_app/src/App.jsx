import { useState } from "react";
/*import Login from "./components/Login";*/
import MainApp from "./MainApp";

const App = () => {
	return <MainApp />;
  /*const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <MainApp />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
    
  );*/
};

export default App;