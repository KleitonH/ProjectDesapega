import { useEffect } from "react";
import { app } from "./firebase/firebaseConfig.jsx";

function App() {
    useEffect(() => {
        console.log("Firebase App iniciado:", app.name);
    }, []);

    return <h1>-  Desapega -</h1>;
}

export default App;
