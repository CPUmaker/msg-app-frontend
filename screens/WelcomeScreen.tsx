import { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { Button } from "@rneui/themed";

import { AuthContext } from "../context/AuthContext";

const { height, width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { login, register } = useContext(AuthContext);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      imagePosition.value,
      [0, 1],
      [-height / 2, 0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [180, 360]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });

  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const loginHandler = () => {
    imagePosition.value = 0;
    if (isRegistering) {
      setIsRegistering(false);
    }
  };

  const registerHandler = () => {
    imagePosition.value = 0;
    if (!isRegistering) {
      setIsRegistering(true);
    }
  };

  const confirmHandler = async () => {
    formButtonScale.value = withSequence(withSpring(1.5), withSpring(1));
    setIsButtonLoading(true);
    if (isRegistering) {
      register(username, password, () => {
        setIsButtonLoading(false);
      });
    } else {
      login(username, password, () => {
        setIsButtonLoading(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height + 100} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height} ry={height + 100} />
          </ClipPath>
          <Image
            href={require("../assets/images/bg.jpg")}
            height={height + 100}
            width={width + 100}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipPathId)"
          />
        </Svg>
        <Animated.View
          style={[styles.closeButtonContainer, closeButtonAnimatedStyle]}
        >
          <TouchableOpacity onPress={() => (imagePosition.value = 1)}>
            <Text>X</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity style={styles.button} onPress={loginHandler}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity style={styles.button} onPress={registerHandler}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.formInputContainer,
            StyleSheet.absoluteFill,
            formAnimatedStyle,
          ]}
        >
          <TextInput
            placeholder={isRegistering ? "Email" : "Email/Username"}
            placeholderTextColor={"black"}
            style={styles.textInput}
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={"black"}
            style={styles.textInput}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Animated.View style={[styles.formButton, formButtonAnimatedStyle]}>
            <Button onPress={confirmHandler} loading={isButtonLoading}>
              <Text style={styles.buttonText}>
                {isRegistering ? "REGISTER" : "LOG IN"}
              </Text>
            </Button>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    justifyContent: "center",
    height: height / 3,
  },
  button: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "rgba(39, 76, 90, 0.6)",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "SpaceMono",
    color: "white",
    letterSpacing: 0.5,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 25,
    paddingLeft: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  formInputContainer: {
    marginBottom: 70,
    zIndex: -1,
  },
  formButton: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "rgba(123, 104, 238, 0.8)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButtonContainer: {
    top: -20,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    backgroundColor: "white",
    borderRadius: 20,
  },
});
