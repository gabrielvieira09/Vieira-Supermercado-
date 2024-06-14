import React, { Profiler } from "react";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Categoria  from "../screens/Categoria";
import Produto from "../screens/Produto";
import ProdutoEditar from "../screens/ProdutoEditar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


 function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Produto" component={Produto} />
      <Stack.Screen name="ProdutoEditar" component={ProdutoEditar} />
      
    </Stack.Navigator>
  );
}

export default function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor:"#F4801A",
        tabBarInactiveBackgroundColor:"#FF9940",
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "HomeStack",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              size={40}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Categoria"
        component={Categoria}
        options={{
          title: "Categoria",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="table-list" size={32} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={32} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

