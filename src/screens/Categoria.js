import { Text, TouchableOpacity, View, Image, StyleSheet, Button, TextInput, FlatList, Alert } from "react-native";
import { useAuth } from "../context/useAuth";
import Logo from "../assets/logo.png"
import Nome from "../assets/nome.png"
import { useEffect, useState } from "react";
import {api} from "../services/api";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Categoria({ updateCategories }) {

    const {signOut} = useAuth();
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await api.get('categories');
      setCategories(response.data);
    } catch (error) {
      console.log(error);
      setError("Não foi possível carregar as categorias.");
    }
  }

  async function deleteCategory(id) {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta categoria?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await api.delete(`categories/${id}`);
              fetchCategories();
              Alert.alert("Sucesso", "Categoria excluída com sucesso!");
              updateCategories(); // Chama a função de atualização de categorias em ProductManagement
            } catch (error) {
              console.log(error);
              setError();
            }
          }
        }
      ]
    );
  }

  function editCategory(id, name) {
    setCategoryName(name);
    setEditingCategory(id);
  }

  async function handleSubmitEdit() {
    setError("");
    if (!categoryName.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    try {
      await api.patch(`categories/${editingCategory}`, {
        name: categoryName,
      });
      Alert.alert("Sucesso", "Categoria atualizada com sucesso!");
      setCategoryName('');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Não foi possível se comunicar com o servidor.");
      }
    }
  }

  async function handleSubmit() {
    setError("");
    if (!categoryName.trim()) {
      setError("Por favor, preencha todos os campos!");
      return;
    }
    try {
      await api.post("categories", {
        name: categoryName,
      });
      Alert.alert("Sucesso", "Categoria criada com sucesso!");
      setCategoryName('');
      fetchCategories();
      updateCategories(); // Chama a função de atualização de categorias em ProductManagement
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
      console.log(error);
      setError();
    }
  }

    return (
        <View style={style.container}>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginHorizontal:20}}>
            <Image source={Logo} style={style.image} />
            <Image source={Nome} style={style.nome} />
            <TouchableOpacity onPress={() => signOut()}>
                <Text style={{fontSize: 20, fontWeight:"bold"}}>Sair</Text>
            </TouchableOpacity>
            </View>

            <View style={{alignItems:"center"}}>
                <TextInput
                value={categoryName}
                placeholder="Nome da Categoria"
                onChangeText={setCategoryName}
                style={{paddingHorizontal:10,height:50,width:370,alignItems:"center",borderRadius:10, borderColor:"#FFA352",marginTop:30, borderWidth:3}} />
                <TouchableOpacity
                onPress={editingCategory ? handleSubmitEdit : handleSubmit}
                style={style.adicionar}>
                    <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>Adicionar Categoria</Text>
                    <Text style={{color:"white", fontSize:30}}>+</Text>
                </TouchableOpacity>
                {error && <Text style={style.error}>{error}</Text>}
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={style.categoryItem}>
                            <Text style={style.categoryName}>{item.name}</Text>
                            <View style={style.buttonsContainer}>
                            <MaterialCommunityIcons name="pencil" size={24} color="black" onPress={() => editCategory(item.id, item.name)} />
                            <MaterialCommunityIcons name="close-thick" size={24} color="black" onPress={() => deleteCategory(item.id)} />
                            </View>
                        </View>
                    )}
                />
            </View>

        </View>
    )
}
const style = StyleSheet.create ({
    container: {
        flex:1,
        backgroundColor: "#F9F9F9",
        margin:0,
    },
    image: {
        width: 75,
        height:75,
      },
      nome: {
        width: 110,
        height:50,
        marginRight:45,
        marginTop:5
      },
      adicionar: {
        backgroundColor:"#EE7001",
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop:10,
        height:50,
        width:370,
        alignItems:"center",
        borderRadius:10,
        marginBottom:40
      },

      categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor:"#FFA352",
        width:270,
        borderRadius:27,
        marginTop:15
      },
      categoryName: {
        marginLeft:10,
        fontSize: 18,
        color:'#000',
        fontWeight:"bold",
        backgroundColor:"#FFA352"
      },
      buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor:"#FFA352"
      },
      error: {
        color: "red",
        fontWeight: "400",
        textAlign: "center",
        marginVertical: 16,
      },
})