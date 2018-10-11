import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  FlatList
} from "react-native";
import LevelItem from "LaserDawn/LevelItem";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashColors: ["#3facff", "#ff4747"],
      flashColor: "#ff4747",
      gameStarted: false,
      diff: 0,
      highscore: 60,
      theme: 1,
      round: 1,
      mode: "oneRound",
      fiveRoundTimes: [],
      levelTime: 0.6,
      levelNumber: 1,
      levels: [
        { levelNumber: 1, key: "1", time: 0.6, completed: "unlocked" },
        { levelNumber: 2, key: "2", time: 0.5, completed: false },
        { levelNumber: 3, key: "3", time: 0.45, completed: false },
        { levelNumber: 4, key: "4", time: 0.4, completed: false },
        { levelNumber: 5, key: "5", time: 0.375, completed: false },
        { levelNumber: 6, key: "6", time: 0.35, completed: false },
        { levelNumber: 7, key: "7", time: 0.3, completed: false },
        { levelNumber: 8, key: "8", time: 0.275, completed: false },
        { levelNumber: 9, key: "9", time: 0.25, completed: false },
        { levelNumber: 10, key: "10", time: 0.2, completed: false },
        { levelNumber: 11, key: "11", time: 0.175, completed: false },
        { levelNumber: 12, key: "12", time: 0.15, completed: false },
        { levelNumber: 13, key: "13", time: 0.125, completed: false },
        { levelNumber: 14, key: "14", time: 0.1, completed: false },
        { levelNumber: 15, key: "15", time: 0.075, completed: false },
        { levelNumber: 16, key: "16", time: 0.05, completed: false },
        { levelNumber: 17, key: "17", time: 0.02, completed: false },
        { levelNumber: 18, key: "18", time: 0.01, completed: false },
        { levelNumber: 19, key: "19", time: 0.005, completed: false },
        { levelNumber: 20, key: "20", time: 0.001, completed: false }
      ]
    };
  }
  setTheme = () => {
    switch (this.state.theme) {
      case 1:
        this.setState({
          flashColors: ["#3facff", "#ff4747"],
          flashColor: "#ff4747"
        });
        break;
      case 2:
        this.setState({
          flashColors: ["#3bd774", "#3facff"],
          flashColor: "#3facff"
        });
        break;
      case 3:
        this.setState({
          flashColors: ["#3205ad", "#00dfe2"],
          flashColor: "#00dfe2"
        });
        break;
      case 4:
        this.setState({
          flashColors: ["#000000", "#ffee00"],
          flashColor: "#ffee00"
        });
        break;
      case 5:
        this.setState({
          flashColors: ["#f345f9", "#444444"],
          flashColor: "#444444"
        });
        break;
      default:
        break;
    }
  };
  startGame = () => {
    if (this.state.mode === "guessTime") {
      var times = [3, 4, 5, 6, 7];
      var chosenTime = times[Math.trunc(Math.random() * 5)];
      var startTime = new Date();
      this.setState({
        chosenTime: chosenTime,
        gameStarted: true,
        startTime: startTime
      });
    } else {
      var timer = setTimeout(() => {
        startTime = new Date();
        this.setState({
          flashColor: this.state.flashColors[0],
          startTime: startTime
        });
      }, Math.random() * (6000 - 3000) + 3000);
      this.setState({ gameStarted: true, timer: timer });
    }
  };

  saveHighscore = async time => {
    await AsyncStorage.setItem("highscore", time.toString()).then(() => {
      this.retrieveHighscore();
    });
  };
  saveTheme = async theme => {
    await AsyncStorage.setItem("theme", theme.toString()).then(() => {
      this.retrieveTheme();
    });
  };
  saveLevels = async () => {
    await AsyncStorage.setItem(
      "levels",
      JSON.stringify(this.state.levels)
    ).then(() => {
      this.retrieveLevels();
    });
  };
  componentDidMount = () => {
    this.retrieveHighscore();
    this.retrieveTheme();
    this.retrieveLevels();
  };
  retrieveLevels = async () => {
    const value = await AsyncStorage.getItem("levels");

    if (value !== null) {
      this.setState({ levels: JSON.parse(value) });
    } else {
    }
  };

  retrieveHighscore = async () => {
    const value = await AsyncStorage.getItem("highscore");

    if (value !== null) {
      this.setState({ highscore: parseFloat(value) });
    } else {
      this.setState({ highscore: 60 });
    }
  };
  retrieveTheme = async () => {
    const value = await AsyncStorage.getItem("theme");

    if (value !== null) {
      this.setState({ theme: parseInt(value) }, () => {
        this.setTheme();
      });
    } else {
      this.saveTheme(1);
      this.setState({ theme: 1 }, () => {
        this.setTheme();
      });
    }
  };
  tap = () => {
    if (this.state.flashColor === this.state.flashColors[1]) {
      if (this.state.mode === "story") {
        this.setState({ levelEndStatus: "Failed" });
      }
      if (this.state.mode === "guessTime") {
        var endTime = new Date();
        var guessedTime = (endTime - this.state.startTime) / 1000;
        var diff = (this.state.chosenTime - guessedTime).toFixed(3);
        this.setState({
          diff: diff + " s",
          gameStarted: "completed",
          guessedTime: guessedTime
        });
      } else {
        clearTimeout(this.state.timer);
        this.setState({
          diff: "Too Soon",
          gameStarted: "completed",
          fiveRoundTimes: [],
          round: 1,
          flashColor: this.state.flashColors[1]
        });
      }
    } else {
      if (this.state.mode === "oneRound" || this.state.mode === "story") {
        endTime = new Date();
        this.setState({ endTime: endTime }, () => {
          if (
            this.state.highscore >
            (this.state.endTime - this.state.startTime) / 1000
          ) {
            this.saveHighscore(
              (this.state.endTime - this.state.startTime) / 1000
            );
          }
          var diff = (this.state.endTime - this.state.startTime) / 1000 + " s";
          if (this.state.mode === "story") {
            if (
              (this.state.endTime - this.state.startTime) / 1000 <
              this.state.levelTime
            ) {
              this.setState({ levelEndStatus: "Success!" });
              var levels = this.state.levels;

              if (
                levels[this.state.levelNumber].completed === true ||
                levels[this.state.levelNumber].completed === "unlocked"
              ) {
              } else {
                var nextLevelTime = levels[this.state.levelNumber].time;

                levels.splice(this.state.levelNumber - 1, 1);
                levels.splice(this.state.levelNumber - 1, 0, {
                  levelNumber: this.state.levelNumber,
                  key: this.state.levelNumber.toString(),
                  time: this.state.levelTime,
                  completed: true
                });
                levels.splice(this.state.levelNumber, 1);
                levels.splice(this.state.levelNumber, 0, {
                  levelNumber: this.state.levelNumber + 1,
                  key: (this.state.levelNumber + 1).toString(),
                  time: nextLevelTime,
                  completed: "unlocked"
                });
                this.setState({ levels: levels }, () => {
                  this.saveLevels();
                });
              }
            } else {
              this.setState({ levelEndStatus: "Failed" });
            }
          }
          this.setState({
            gameStarted: "completed",
            flashColor: this.state.flashColors[1],
            diff: diff
          });
        });

        clearTimeout(this.state.timer);
      } else if (this.state.mode === "fiveRound") {
        if (this.state.round === 5) {
          clearTimeout(this.state.timer);
          endTime = new Date();
          this.setState(
            {
              endTime: endTime
            },
            () => {
              var diff = (this.state.endTime - this.state.startTime) / 1000;
              var fiveRoundTimes = this.state.fiveRoundTimes;
              var average =
                (fiveRoundTimes[0] +
                  fiveRoundTimes[1] +
                  fiveRoundTimes[2] +
                  fiveRoundTimes[3] +
                  diff) /
                5;
              this.setState({
                fiveRoundTimes: [],
                round: 1,
                diff: "Average: " + average.toFixed(3) + " s",
                flashColor: this.state.flashColors[1],
                gameStarted: "completed"
              });
            }
          );
        } else {
          clearTimeout(this.state.timer);

          endTime = new Date();
          this.setState({ endTime: endTime }, () => {
            var diff = (this.state.endTime - this.state.startTime) / 1000;

            var fiveRoundTimes = this.state.fiveRoundTimes;
            fiveRoundTimes.push(diff);
            this.setState(
              {
                fiveRoundTimes: fiveRoundTimes,
                round: this.state.round + 1,
                flashColor: this.state.flashColors[1]
              },
              () => {
                this.startGame();
              }
            );
          });
        }
      }
    }
  };

  render() {
    const flashColor = { backgroundColor: this.state.flashColor };
    const button = { backgroundColor: this.state.flashColors[0] };

    if (this.state.gameStarted === false) {
      var oneRound = (
        <TouchableOpacity onPress={() => this.setState({ mode: "oneRound" })}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#a8a8a8",
              fontSize: 25,
              margin: 20,
              textAlign: "center"
            }}
          >
            1 Round
          </Text>
        </TouchableOpacity>
      );
      var fiveRound = (
        <TouchableOpacity onPress={() => this.setState({ mode: "fiveRound" })}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#a8a8a8",
              fontSize: 25,
              margin: 20,
              textAlign: "center"
            }}
          >
            5 Rounds
          </Text>
        </TouchableOpacity>
      );
      var guessTime = (
        <TouchableOpacity onPress={() => this.setState({ mode: "guessTime" })}>
          <Text
            style={{
              fontWeight: "bold",
              color: "#a8a8a8",
              fontSize: 25,
              margin: 20,
              textAlign: "center"
            }}
          >
            Guess The Time
          </Text>
        </TouchableOpacity>
      );
      var story = (
        <TouchableOpacity
          onPress={() => this.setState({ gameStarted: "story" })}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: "#a8a8a8",
              fontSize: 25,
              margin: 20,
              textAlign: "center"
            }}
          >
            Story
          </Text>
        </TouchableOpacity>
      );
      if (this.state.mode === "oneRound" || this.state.mode === "story") {
        var oneRound = (
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                fontSize: 25,
                margin: 20,
                textAlign: "center"
              }}
            >
              1 Round
            </Text>
          </TouchableOpacity>
        );
      } else if (this.state.mode === "fiveRound") {
        var fiveRound = (
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                fontSize: 25,
                margin: 20,
                textAlign: "center"
              }}
            >
              5 Rounds
            </Text>
          </TouchableOpacity>
        );
      } else if (this.state.mode === "guessTime") {
        var guessTime = (
          <TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                color: "black",
                fontSize: 25,
                margin: 20,
                textAlign: "center"
              }}
            >
              Guess The Time
            </Text>
          </TouchableOpacity>
        );
      }

      var view = (
        <View style={styles.containerCentered}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => this.setState({ gameStarted: "profile" })}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              Profile
            </Text>
          </TouchableOpacity>
          {oneRound}
          {fiveRound}
          {guessTime}
          {story}
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              this.startGame();
            }}
          >
            <Text style={styles.text}>Start</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.gameStarted === "completed") {
      if (this.state.mode === "guessTime") {
        cheer = null;
        var target = (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              margin: 20,
              textAlign: "center"
            }}
          >
            Target: {this.state.chosenTime} s
          </Text>
        );

        var yourTime = (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              margin: 20,
              textAlign: "center"
            }}
          >
            Your time: {this.state.guessedTime}
          </Text>
        );
      } else if (this.state.mode === "story") {
        var cheer = this.state.levelEndStatus;
        var target = (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              margin: 20,
              textAlign: "center"
            }}
          >
            Target: {this.state.levelTime} s
          </Text>
        );

        var yourTime = null;
      } else {
        var target = null;
        var yourTime = null;
        var diff = parseFloat(this.state.diff);
        var cheer;
        if (diff < 0.005) {
          cheer = "You are the G.O.A.T";
        } else if (diff < 0.01) {
          cheer = "Almost the best!";
        } else if (diff < 0.05) {
          cheer = "Unreal speed";
        } else if (diff < 0.1) {
          cheer = "Inhumane speed!";
        } else if (diff < 0.15) {
          cheer = "That's faaaaaaast!";
        } else if (diff < 0.2) {
          cheer = "Are you human?!";
        } else if (diff < 0.25) {
          cheer = "You guessed, right?";
        } else if (diff < 0.3) {
          cheer = "Getting faster!";
        } else if (diff < 0.35) {
          cheer = "Speeeeed! ";
        } else if (diff < 0.4) {
          cheer = "Getting there";
        } else if (diff < 0.5) {
          cheer = "Room to improve!";
        } else if (diff < 1.0) {
          cheer = "you can do better :)";
        } else if (diff < 5.0) {
          cheer = "That's pretty slow :D";
        } else if (diff < 60.0) {
          cheer = "You pushing the limits";
        } else if (diff < 600.0) {
          cheer = "This is a reaction game, right?";
        } else if (diff < 6000.0) {
          cheer = "G.O.A.T in slowness!";
        } else if (diff < 60000.0) {
          cheer = "You have completed the game.";
        }
      }
      if (
        this.state.mode === "story" &&
        this.state.levelEndStatus === "Success!"
      ) {
        var cheerColor = { color: "#3bd774" };
      } else if (
        this.state.mode === "story" &&
        this.state.levelEndStatus === "Failed"
      ) {
        var cheerColor = { color: "#ff4747" };
      } else {
        var cheerColor = { color: "black" };
      }
      var view = (
        <View style={styles.containerCentered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (this.state.mode === "story") {
                this.setState({ gameStarted: "story", mode: "oneRound" });
              } else {
                this.setState({ gameStarted: false });
              }
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              Back
            </Text>
          </TouchableOpacity>
          <View>
            <Text
              style={[
                {
                  fontWeight: "bold",
                  fontSize: 26,
                  margin: 20,
                  textAlign: "center"
                },
                cheerColor
              ]}
            >
              {cheer}
            </Text>
            {target}
            {yourTime}

            <Text
              style={{
                fontWeight: "bold",
                fontSize: 26,
                margin: 20,
                textAlign: "center"
              }}
            >
              {this.state.diff}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => {
              this.startGame();
            }}
          >
            <Text style={styles.text}>Again</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.gameStarted === "profile") {
      var theme1 = (
        <TouchableOpacity
          style={{ width: 30, height: 30, margin: 4, opacity: 0.4 }}
          onPress={() =>
            this.saveTheme(1).then(() => {
              this.setState({ gameStarted: false });
            })
          }
        >
          <View
            style={{
              backgroundColor: "#ff4747",
              flex: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          />

          <View
            style={{
              backgroundColor: "#3facff",
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          />
        </TouchableOpacity>
      );
      var theme2 = (
        <TouchableOpacity
          style={{ width: 30, height: 30, margin: 4, opacity: 0.4 }}
          onPress={() =>
            this.saveTheme(2).then(() => {
              this.setState({ gameStarted: false });
            })
          }
        >
          <View
            style={{
              backgroundColor: "#3facff",
              flex: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          />

          <View
            style={{
              backgroundColor: "#3bd774",
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          />
        </TouchableOpacity>
      );
      var theme3 = (
        <TouchableOpacity
          style={{ width: 30, height: 30, margin: 4, opacity: 0.4 }}
          onPress={() =>
            this.saveTheme(3).then(() => {
              this.setState({ gameStarted: false });
            })
          }
        >
          <View
            style={{
              backgroundColor: "#00dfe2",
              flex: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          />

          <View
            style={{
              backgroundColor: "#3205ad",
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          />
        </TouchableOpacity>
      );
      var theme4 = (
        <TouchableOpacity
          style={{ width: 30, height: 30, margin: 4, opacity: 0.4 }}
          onPress={() =>
            this.saveTheme(4).then(() => {
              this.setState({ gameStarted: false });
            })
          }
        >
          <View
            style={{
              backgroundColor: "#ffee00",
              flex: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          />

          <View
            style={{
              backgroundColor: "#000000",
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          />
        </TouchableOpacity>
      );
      var theme5 = (
        <TouchableOpacity
          style={{ width: 30, height: 30, margin: 4, opacity: 0.4 }}
          onPress={() =>
            this.saveTheme(5).then(() => {
              this.setState({ gameStarted: false });
            })
          }
        >
          <View
            style={{
              backgroundColor: "#444444",
              flex: 1,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          />

          <View
            style={{
              backgroundColor: "#f345f9",
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          />
        </TouchableOpacity>
      );
      if (this.state.theme === 1) {
        var theme1 = (
          <TouchableOpacity style={{ width: 30, height: 30, margin: 4 }}>
            <View
              style={{
                backgroundColor: "#ff4747",
                flex: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />

            <View
              style={{
                backgroundColor: "#3facff",
                flex: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5
              }}
            />
          </TouchableOpacity>
        );
      } else if (this.state.theme === 2) {
        var theme2 = (
          <TouchableOpacity style={{ width: 30, height: 30, margin: 4 }}>
            <View
              style={{
                backgroundColor: "#3facff",
                flex: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />

            <View
              style={{
                backgroundColor: "#3bd774",
                flex: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5
              }}
            />
          </TouchableOpacity>
        );
      } else if (this.state.theme === 3) {
        var theme3 = (
          <TouchableOpacity style={{ width: 30, height: 30, margin: 4 }}>
            <View
              style={{
                backgroundColor: "#00dfe2",
                flex: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />

            <View
              style={{
                backgroundColor: "#3205ad",
                flex: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5
              }}
            />
          </TouchableOpacity>
        );
      } else if (this.state.theme === 4) {
        var theme4 = (
          <TouchableOpacity style={{ width: 30, height: 30, margin: 4 }}>
            <View
              style={{
                backgroundColor: "#ffee00",
                flex: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />

            <View
              style={{
                backgroundColor: "#000000",
                flex: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5
              }}
            />
          </TouchableOpacity>
        );
      } else if (this.state.theme === 5) {
        var theme5 = (
          <TouchableOpacity style={{ width: 30, height: 30, margin: 4 }}>
            <View
              style={{
                backgroundColor: "#444444",
                flex: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5
              }}
            />

            <View
              style={{
                backgroundColor: "#f345f9",
                flex: 1,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5
              }}
            />
          </TouchableOpacity>
        );
      }

      var view = (
        <View style={styles.containerCentered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.setState({ gameStarted: false })}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              Back
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 22, margin: 10 }}>
            Theme
          </Text>
          <View style={{ flexDirection: "row" }}>
            {theme1}
            {theme2}
            {theme3}
            {theme4}
            {theme5}
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 25, margin: 20 }}>
            High score: {this.state.highscore} s
          </Text>
        </View>
      );
    } else if (this.state.gameStarted === "story") {
      var view = (
        <View style={styles.containerLevel}>
          <TouchableOpacity
            style={styles.backButtonLevel}
            onPress={() => this.setState({ gameStarted: false })}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              Back
            </Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.levels}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  if (
                    item.completed === true ||
                    item.completed === "unlocked"
                  ) {
                    this.setState(
                      {
                        mode: "story",
                        levelTime: item.time,
                        levelNumber: item.levelNumber
                      },
                      () => {
                        this.startGame();
                      }
                    );
                  }
                }}
              >
                <LevelItem {...item} />
              </TouchableOpacity>
            )}
          />
        </View>
      );
    } else {
      if (this.state.mode === "fiveRound") {
        var round = (
          <TouchableOpacity style={styles.backButton}>
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              {this.state.round}
              /5
            </Text>
          </TouchableOpacity>
        );
      } else if (this.state.mode === "guessTime") {
        var round = (
          <TouchableOpacity style={styles.backButton}>
            <Text style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
              Guess when {this.state.chosenTime} s has elapsed and tap!
            </Text>
          </TouchableOpacity>
        );
      } else {
        var round = null;
      }
      var view = (
        <TouchableOpacity
          style={styles.container}
          activeOpacity={0.0}
          onPress={() => {
            this.tap();
          }}
        >
          <View style={[styles.flash, flashColor]}>{round}</View>

          <View style={[styles.button, button]} />
        </TouchableOpacity>
      );
    }
    return view;
  }
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white"
  },
  containerLevel: {
    flex: 1,
    backgroundColor: "white"
  },
  item: {
    width: "100%"
  },

  profileButton: {
    position: "absolute",
    margin: 10,
    top: 6,
    right: 0
  },

  backButton: {
    position: "absolute",
    margin: 10,
    top: 6,
    left: 0
  },

  backButtonLevel: {
    margin: 10
  },

  container: {
    flex: 1,
    backgroundColor: "white"
  },

  playButton: {
    backgroundColor: "#ff4747",
    borderRadius: 20,
    margin: 20,
    flex: 0.25,
    width: "95%",
    alignItems: "center",
    justifyContent: "center"
  },

  text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
    margin: 0
  },

  button: {
    flex: 1
  },

  flash: {
    flex: 1
  }
});
