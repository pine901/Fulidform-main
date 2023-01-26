import { LogBox } from "react-native";

if (__DEV__) {
  const ignoreWarns = [
    "ViewPropTypes will be removed from React Native.",
    "componentWillReceiveProps has been renamed, and is not recommended for use.",
    "Warning: Failed prop type: Invalid prop `color` supplied to `Text`",
    "new NativeEventEmitter()` was called with a non-null argument",
    "Warning: componentWillMount has been renamed",
    "componentWillMount has been renamed",
    "Require cycles are allowed, but can result in uninitialized values"
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (arg[0].startsWith(warning)) {
        return;
      }
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}