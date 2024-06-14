import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function MyButton({ backgroundColor, text, onPress, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor || "#EE7001" },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height:50,
    alignItems: "center",
    borderRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize:18,
    fontWeight: "500",
  },
});
