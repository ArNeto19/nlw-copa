import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Loading } from "./src/components/Loading";
import { THEME } from "./src/styles/theme";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { Routes } from "./src/routes";

export default function App() {
  const [fonstLoaded] = useFonts({ Roboto_400Regular, Roboto_500Medium, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        {fonstLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
