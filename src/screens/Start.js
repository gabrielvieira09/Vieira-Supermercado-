import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Image, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../assets/logo.png";
import Nome from "../assets/nome.png";
import MyButton from "../components/MyButton";
import { useAuth } from "../context/useAuth";

export default function Start() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  async function handleSubmit() {
    try {
      setError("")
      await signIn({email, password})
    }
    catch {error} {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError("Falha no Login. Verifique suas credenciais.")
      }
    }
  }
  
  
  return (
    <View style={style.container}>
      <StatusBar backgroundColor="#1b1b1f" barStyle="light-content" />
      <View style={{ height:200, width:200, alignItems:"center"}}>
      <Image source={Logo} style={style.image} />
      <Image source={Nome} style={style.nome} />
      <Text style={{fontWeight:"bold", fontSize:20, marginLeft:20, marginBottom:10}}>Supermercado</Text>
      </View>
      <View style={{}}>
        <View style={{alignItems:"center"}}>
          <Text style={{fontSize:45, marginTop:150,fontWeight:"bold", color:"#EE7001"}}>Login</Text>
        </View>
        <View style={{alignItems:"center", marginTop:20}}>
          <Text style={{fontWeight:"bold", fontSize:17, marginBottom:5, marginRight:290}}>Email</Text>
          <View style={style.inputBox}>
            <TextInput style={style.input} placeholder="abcd@gmail.com"
            placeholderTextColor="#8a8787" keyboardType="email-address"
            value={email} onChangeText={(text) => setEmail(text)} />
          </View>
          <Text style={{fontWeight:"bold", fontSize:17, marginBottom:5,marginTop:20, marginRight:290}}>Senha</Text>
          <View style={style.inputBox}>
            <TextInput style={style.input} placeholder="123456"
            placeholderTextColor="#8a8787" secureTextEntry
            value={password} onChangeText={(text) => setPassword(text)} />
          </View>
          {error && <Text style={style.erro}>{error}</Text>}
          <MyButton onPress={handleSubmit} text="Entrar" style={{width:"45%", backgroundColor:"#EE7001", marginTop:30, textAlign:"center", justifyContent:"center", borderRadius:15}} />
          </View>
        </View>
        <View style={{backgroundColor:"#E2DDDD", width:"100%", height:65, alignItems:"center", justifyContent:"center" }}>
          <View style={style.texts}>
            <Text>Ainda não possui conta?</Text>
            <MyButton text="Cadastrar" onPress={() => navigation.navigate("SignUp")} style={{width:120, height:30, marginLeft:10,backgroundColor:"#F79900", borderRadius:20,textAlign:"center", justifyContent:"center"}}/>
          </View>
        </View>  
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
    margin:0,
    padding:0
  },
  image: {
    height: 200,
  },
  nome: {
    width: 200,
    height:80
  },
  texts: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection:"row"
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    width: 200,
    color: "#F4F5F6",
    textAlign: "center",
  },
  subtitle: {
    fontWeight: "400",
    color: "#AEAEB3",
    marginTop: 16,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#8a8787",
    borderRadius: 20,
    width: 350,
  },
  erro: {
    color: "#DC1637",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 10,
    marginBottom: -10
  },
});
