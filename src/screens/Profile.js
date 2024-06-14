import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { useAuth } from "../context/useAuth";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import { api } from "../services/api";
import UserPhoto from "../assets/user.png";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [editable, setEditable] = useState(false);
  const { updateUser, signOut } = useAuth();

  async function handleSubmit() {
    setError("");
    if(!email.trim() || !username.trim() || !password.trim()){
      setError("Preencha todos os campos");
      return;
    }
    try{
      await api.patch("profile",{
        email,
        username,
        password,
      })
      Alert.alert("Sucesso","Usuário atualizado com sucesso!");
      setEditable(false)
    } catch(error){
      if(error.response){
        setError(error.response.data.message);
      }
      else{
        setError("Não foi possível se comunicar com o servidor");
      }
    }
  }

  async function pickImage() {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permissão necessária",
        "É necessário permitir acesso à galeria!"
      );
      return;
    }


    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      minWidth: 200,
      minHeight: 200,
      quality: 1,
    });


    if (pickerResult.canceled) {
      return;
    }


    if (pickerResult.assets && pickerResult.assets.length > 0) {
      const { width, height } = pickerResult.assets[0];


      if (width < 200 || height < 200) {
        Alert.alert(
          "Imagem muito pequena",
          "Escolha uma imagem com pelo menos 200x200 pixels."
        );
        return;
      }


      const uri = pickerResult.assets[0].uri;
      setPhotoUrl(uri);
      uploadPhoto(uri);
    } else {
      console.error("No assets found in pickerResult");
    }
  }

  async function uploadPhoto(localUri) {
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;


    let formData = new FormData();
    formData.append("photo", { uri: localUri, name: filename, type });


    try {
      const response = await api.put("/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        const fullPhotoUrl = `${updatedUser.photoUrl}`;
        setPhotoUrl(fullPhotoUrl);
        updatedUser.photoUrl = fullPhotoUrl;
        updateUser(updatedUser);
        Alert.alert("Sucesso", "Foto atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao enviar a foto: ", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Não foi possível conectar ao servidor");
      }
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {data} = await api.get("/profile");
        setEmail(data.email);
        setUsername(data.username);
        setPhotoUrl(data.photoUrl);
      }
      catch (error){
        console.log(error);
      }
    };
    fetchUserProfile();
  },[])

  return (
    <ScrollView contentContainerStyle={style.container}>
      <View style={{ backgroundColor: "#FF9940", alignItems: "center" }}>
        <View style={style.header}>
          <TouchableOpacity onPress={() => setEditable(true)}>
            <MaterialCommunityIcons name="pencil" size={28} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 28, fontWeight: "600", color: "#000000" }}>
            Perfil
          </Text>
          <TouchableOpacity onPress={() => signOut()}>
            <MaterialCommunityIcons name="logout" size={28} color="#000000" />
          </TouchableOpacity>
        </View>
         <View style={style.profileImageContainer}>
          <Image
          key={photoUrl}
          style={style.profileImage}
          source={
            photoUrl ? {uri:`http://10.0.2.2:3333/${photoUrl}`} : UserPhoto
          }
          />
          <TouchableOpacity style={style.cameraButton} onPress={pickImage}>
            <MaterialIcons name="camera-alt" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={style.username}>{username}</Text>

      <View
        style={{
          padding: 16,
          flex: 1,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            gap: 16,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "400",
            }}
          >
            Meus Dados
          </Text>
          <View style={style.inputBox}>
            <Feather name="user" size={24} color="#8a8787" />
            <TextInput
              value={username}
              style={style.input}
              editable={editable}
              onChangeText={(text) => setUsername(text)}
              placeholderTextColor="#AEAEB3"
            />
          </View>
          <View style={style.inputBox}>
            <Feather name="mail" size={24} color="#8a8787" />
            <TextInput
              value={email}
              style={style.input}
              editable={editable}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="#AEAEB3"
            />
          </View>
          <View>
            {editable && (
            <View style={style.inputBox}>
              <Feather name="lock" size={24} color="#8a8787" />
              <TextInput
                style={style.input}
                value={password}
                editable={editable}
                onChangeText={(text) => {
                  setPassword(text);
                }}
                placeholderTextColor="#AEAEB3"
                secureTextEntry
                placeholder="Senha atual ou nova senha"
              />
            </View>
            )}
            <Text style={style.error}>{error}</Text>
          </View>
        </View>
        {editable && (  <View style={{ gap: 8, marginTop: 16, flexDirection: "row"}}>
          <MyButton onPress={() => setEditable(false)} style={{ flex: 1, justifyContent:"center"}} text="Cancelar" />
          <MyButton style={{ flex: 1, justifyContent:"center"}} text="Salvar alterações" onPress={() => handleSubmit()} />
        </View>
        )}
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    alignItems: "flex-start",
  },
  header: {
    backgroundColor: "#FF9940",
    width: "100%",
    padding: 12,
    height: 100,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImageContainer: {
    alignItems: "center",
    position: "relative",
    marginTop: 20,
    marginBottom: -100,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "#000000",
  },
  username: {
    alignSelf: "center",
    marginTop: 120,
    width: "60%",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 40,
    fontWeight: "600",
  },
  cameraButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#000000",
    padding: 8,
    borderRadius: 100,
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
    marginTop: 8,
  },
});
