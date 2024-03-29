import { useTheme } from "native-base";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { Join } from "../screens/Join";
import { New } from "../screens/New";
import { Polls } from "../screens/Polls";
import { Platform } from "react-native";
import { Details } from "../screens/Details";

const { Navigator, Screen } = createBottomTabNavigator();

export const AppRoutes = () => {
  const { colors } = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: "absolute",
          height: 87,
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: "relative",
          top: Platform.OS === "android" ? -10 : 0,
        },
      }}>
      <Screen
        name="new"
        component={New}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} />,
          tabBarLabel: "Criar Bolão",
        }}
      />
      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} />,
          tabBarLabel: "Meus bolões",
        }}
      />
      <Screen name="join" component={Join} options={{ tabBarButton: () => null }} />

      <Screen name="details" component={Details} options={{ tabBarButton: () => null }} />

    </Navigator>
  );
};
