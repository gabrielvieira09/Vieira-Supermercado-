import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";
import Home from "./src/screens/Home";
import Categoria  from "./src/screens/Categoria";
import Profile from "./src/screens/Profile"
import Produto from "./src/screens/Produto";
import AppProvider from "./src/context";


export default function App() {
    return (
        <NavigationContainer>
            <AppProvider>
                <Routes/>
            </AppProvider>
        </NavigationContainer>
    );
};