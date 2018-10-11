import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
export default class LevelItem extends React.PureComponent {
  // toggle a todo as completed or not via update()

  render() {
    var levelNumber = (
      <Text style={styles.textGray}>Level {this.props.levelNumber}</Text>
    );
    if (this.props.completed === true) {
      return <View style={styles.levelCompleted}>{levelNumber}</View>;
    } else if (this.props.completed === false) {
      return <View style={styles.levelLocked}>{levelNumber}</View>;
    }else if(this.props.completed === "unlocked"){
      return <View style={styles.levelUnlocked}>{levelNumber}</View>;

    }
  }
}
const styles = StyleSheet.create({
  levelUnlocked: {
    borderWidth: 3,
    borderColor: "#e5e5e5",
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  levelLocked: {
    borderWidth: 3,
    borderColor: "#ff4747",
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },

  levelCompleted: {
    borderWidth: 3,
    borderColor: "#3bd774",
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },

  textGray: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 20,
    flexWrap: "wrap"
  },

  fieldImage: {
    width: 50,
    height: 50,

    marginStart: 8,
    borderWidth: 5,
    borderColor: "white",
    margin: 5
  }
});
