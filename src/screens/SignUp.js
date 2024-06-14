import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import Logo from "../assets/logo.png";
import Nome from "../assets/nome.png";
import {Text,TextInput,View,StatusBar,StyleSheet,TouchableOpacity, Alert, Image} from "react-native";
import MyButton from "../components/MyButton";

export default function SignUp() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function hundleSubmit() {
    setError("");
    if (!email.trim() || !username.trim() || !password.trim()){
      setError("Por favor, preencha todos os campos!")
      return
    }
    try {
      await api.post("register",{
        email,
        username,
        password,
      });
      Alert.alert("sucesso", "usuário criado com sucesso!");
    }
    catch(err) {
      if(err.response){
        setError(err.response.data.message);
      }
      setError("Não foi possível se conectar com o servidor")
    }
  }

  return (
    <View style={style.container}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={45} color="#000000" />
      </TouchableOpacity>
      <Text style={{fontSize:45,fontWeight:"bold", color:"#EE7001", marginLeft:55}}>Cadastrar</Text>
      </View>
      <View style={{gap: 16}}>
        <View style={style.inputBox}>
          <Feather name="user" size={24} color="#000000" />
          <TextInput style={style.input} placeholder="Digite seu nome"
          placeholderTextColor="#8a8787" keyboardType="email-address"
          value={username} onChangeText={(text)=> setUsername(text)}
          />
        </View>
        <View style={style.inputBox}>
          <Feather name="mail" size={24} color="#000000" />
          <TextInput style={style.input} placeholder="Digite seu email"
          placeholderTextColor="#8a8787" keyboardType="email-address"
          value={email} onChangeText={(text)=> setEmail(text)}
          />
        </View>
        <View style={style.inputBox}>
          <Feather name="lock" size={24} color="#000000" />
          <TextInput style={style.input} placeholder="Digite sua senha"
          placeholderTextColor="#8a8787" secureTextEntry
          value={password} onChangeText={(text)=> setPassword(text)}
          />
        </View>
        {error && <Text style={style.error}>{error}</Text>}
        <MyButton onPress={()=>hundleSubmit()} text="Cadastrar" style={{width:"100%", backgroundColor:"#EE7001", justifyContent:"center"}} />
      </View>
      <View style={{ height:400, width:370, alignItems:"center"}}>
      <Image source={Logo} style={style.image} />
      <Image source={Nome} style={style.nome} />
      <Text style={{fontWeight:"bold", fontSize:20, marginLeft:20, marginBottom:10}}>Supermercado</Text>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F9F9F9",
  },

  title: {
    fontSize: 54,
    fontWeight: "700",
    width: 240,
    color: "#3D3D4D",
  },

  subtitle: {
    fontSize: 20,
    fontWeight: "300",
    width: 280,
    marginTop: 16,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#8a8787",
    borderRadius: 4,
    width: "100%",
  },

  input: {
    flex: 1,
    fontSize: 18,
  },
  error: {
    color: "#DC1637",
    fontWeight: "400",
    textAlign: "center",
    marginVertical: 16,
  },
  image: {
    height: 200,
  },
  nome: {
    width: 200,
    height:80
  },
});
