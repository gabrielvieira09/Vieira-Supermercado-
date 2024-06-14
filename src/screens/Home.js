import { Text, TouchableOpacity, View, Image, StyleSheet, FlatList, Alert, ScrollView, TextInput } from "react-native";
import { useAuth } from "../context/useAuth";
import Logo from "../assets/logo.png"
import Nome from "../assets/nome.png"
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home(updateProducts, data) {

  const { signOut } = useAuth();
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [categorias, setCategorias] = useState("");
  const [query, setQuery] = useState("");

  const filteredProdutos = products.filter((item) => {
    return item.name.toLowerCase().includes(query.toLowerCase());
  });

  useEffect(() => {
    fetchCategories();
  }, [data]);
  async function fetchCategories() {
    try {
      const responseData = await api.get('categories');
      const response = responseData.data;
      const category = response.find(a => a.id === data.categoryId);
      if (category) {
        setCategorias(category.name);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }

  const deleteItem = async (id) => {
    try {
      await api.delete(`products/${id}`);
      fetchProducts();
      Alert.alert("Sucesso!", "Produto excluido com sucesso!")
    }
    catch (error) {
      console.error('Erro ao deletar o Produto', error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await api.get('products');
      setProducts(response.data);
    } catch (error) {
      console.log(error);
      setError("Não foi possível carregar as categorias.");
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return (
    <ScrollView style={style.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20 }}>
        <Image source={Logo} style={style.image} />
        <Image source={Nome} style={style.nome} />
        <TouchableOpacity onPress={() => signOut()}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <View style={{borderRadius:10,flexDirection:"row", alignItems:"center", justifyContent:"center",marginTop:20,width:350, borderColor:"#EE7001", borderWidth:2}}>
        <View style={{marginLeft:15}}>
          <Feather name="search" size={24} color="#EE7001" />
        </View>
        <TextInput  onChangeText={(text) => setQuery(text)} style={{width:320, height:50}} />
      </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Produtos</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Produto")}>
          <MaterialIcons name="add-box" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <FlatList
        numColumns={2}
        style={{marginLeft:15}}
          data={filteredProdutos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={style.produtoContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10, marginTop: 10 }}>
                <MaterialCommunityIcons name="pencil" size={24} color="black" onPress={() => navigation.navigate("ProdutoEditar", item)} />
                <MaterialCommunityIcons name="close-thick" size={24} color="black" onPress={() => deleteItem(item.id)} />
              </View>
              <View style={{ width: "100%", height: "60%", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
                { item.category&& <Text>{item.category.name}</Text>}
               
              </View>
              <View style={style.buttonsProduto}>
                <View style={style.produtoCategoria}>
                  <Text style={{ color: "white" }}>Estoque:   {item.amount}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
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
  produtoContainer: {
    width: "45%",
    height: 180,
    backgroundColor: "#D9D9D9",
    borderRadius: 25,
    marginHorizontal: 5,
    marginTop:20
  },
  produtoCategoria: {
    backgroundColor: "#EE7001",
    width: "100%",
    height: 35,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems:"center",
    justifyContent:"center"
  }
})