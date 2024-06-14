import { Text, TouchableOpacity, View, Image, StyleSheet, TextInput, Alert } from "react-native";
import { useAuth } from "../context/useAuth";
import Logo from "../assets/logo.png"
import Nome from "../assets/nome.png"
import camera from "../assets/camera.png";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
import MyButton from "../components/MyButton";
import { api } from "../services/api";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function Produto() {

  const { signOut } = useAuth();
  const navigation = useNavigation();
  const [photoUrl, setPhotoUrl] = useState("");
  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");


  // async function pickImage() {
  //   let permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (permissionResult.granted === false) {
  //     Alert.alert(
  //       "Permissão necessária",
  //       "É necessário permitir acesso à galeria!"
  //     );
  //     return;
  //   }


  //   let pickerResult = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     minWidth: 200,
  //     minHeight: 200,
  //     quality: 1,
  //   });


  //   if (pickerResult.canceled) {
  //     return;
  //   }


  //   if (pickerResult.assets && pickerResult.assets.length > 0) {
  //     const { width, height } = pickerResult.assets[0];


  //     if (width < 200 || height < 200) {
  //       Alert.alert(
  //         "Imagem muito pequena",
  //         "Escolha uma imagem com pelo menos 200x200 pixels."
  //       );
  //       return;
  //     }


  //     const uri = pickerResult.assets[0].uri;
  //     setPhotoUrl(uri);
  //     uploadPhoto(uri);
  //   } else {
  //     console.error("No assets found in pickerResult");
  //   }
  // }

  // async function uploadPhoto(localUri) {
  //   let filename = localUri.split("/").pop();
  //   let match = /\.(\w+)$/.exec(filename);
  //   let type = match ? `image/${match[1]}` : `image`;


  //   let formData = new FormData();
  //   formData.append("photo", { uri: localUri, name: filename, type });


  //   try {
  //     const response = await api.put("/upload-photo", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (response.data && response.data.user) {
  //       const updatedUser = response.data.user;
  //       const fullPhotoUrl = `${updatedUser.photoUrl}`;
  //       setPhotoUrl(fullPhotoUrl);
  //       updatedUser.photoUrl = fullPhotoUrl;
  //       updateUser(updatedUser);
  //       Alert.alert("Sucesso", "Foto atualizada com sucesso!");
  //     }
  //   } catch (error) {
  //     console.error("Erro ao enviar a foto: ", error);
  //     if (error.response) {
  //       setError(error.response.data.message);
  //     } else {
  //       setError("Não foi possível conectar ao servidor");
  //     }
  //   }
  // }

  async function fetchCategories() {
    try {
      const response = await api.get('categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
      setError("Não foi possível carregar as categorias.");
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, [])
  );
  async function handleSubmit() {
    setError("");
    if (!productName.trim() || !productQuantity.trim() || !selectedCategory) {
      setError("Por favor, preencha todos os campos!");
      return;
    }
  
    try {
      const categoryId = selectedCategory.id;
      await api.post("products", {
        name: productName,
        amount: Number(productQuantity),
        categoryId: categoryId,
      });
      Alert.alert("Sucesso", "Produto criado com sucesso!");
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao conectar-se ao servidor");
      }
    }
  }


  return (
    <View style={style.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20 }}>
        <Image source={Logo} style={style.image} />
        <Image source={Nome} style={style.nome} />
        <TouchableOpacity onPress={() => signOut()}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={style.principal}>
        {/* <TouchableOpacity onPress={pickImage}>
          <View style={style.profileImageContainer}>

            <Image
              key={photoUrl}
              style={style.profileImage}
              source={
                photoUrl ? { uri: `http://10.0.2.2:3333/${photoUrl}` } : camera
              }
            />
          </View>
        </TouchableOpacity> */}
        <View style={style.cadastro}>
          <View style={{ gap: 10, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>Nome:</Text>
            <TextInput
              value={productName}
              onChangeText={(text) => setProductName(text)}
              style={{ width: 200, height: 40, backgroundColor: "white", borderRadius: 3, borderColor: "#B4B4B4", borderWidth: 2 }}></TextInput>
          </View>
          <View style={{ gap: 25, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 40 }}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>Estoque:</Text>
            <TextInput
              value={productQuantity}
              onChangeText={(text) => setProductQuantity(text)}
              style={{ width: 150, height: 40, backgroundColor: "white", borderRadius: 3, borderColor: "#B4B4B4", borderWidth: 2 }}></TextInput>
          </View>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={style.picker}
          >
            <Picker.Item style={{ fontSize: 20 }} label="Categoria" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category} />
            ))}
          </Picker>
        </View>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <View style={{ width: "100%", height: 114, alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{ width: "80%", height: 50, borderRadius: 10, backgroundColor: "#EE7001", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    margin: 0,
  },
  image: {
    width: 75,
    height: 75,
  },
  nome: {
    width: 110,
    height: 50,
    marginRight: 45,
    marginTop: 5
  },
  principal: {
    width: "auto",
    height: "85%",
    backgroundColor: "#D9D9D9",
    margin: 15,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 3,
    alignItems: "center"
  },
  profileImageContainer: {
    alignItems: "center",
    position: "relative",
    marginTop: 50,
    backgroundColor: "white",
    height: 200,
    width: 200,
    justifyContent: "center",
    borderRadius: 500,
    borderColor: "black",
    borderWidth: 6,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 6,
  },
  picker: {
    backgroundColor: "#FFA353",
    width: 280,
    borderRadius: 5,
    marginTop: 40,
  },
  cadastro: {
    marginTop: 40,
    width: "100%",
    height: 250,
    alignItems: "center"
  },
})