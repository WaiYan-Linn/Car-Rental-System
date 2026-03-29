import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function ChatLayout() {
  return (
    <KeyboardProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </KeyboardProvider>
  );
}
