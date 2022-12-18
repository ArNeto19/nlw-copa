import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import { useAuth } from "../hooks/useAuth";
import { SignIn } from "../screens/SignIn";

export const Routes = () => {
  const { user } = useAuth();

  return <NavigationContainer>{!user ? <SignIn /> : <AppRoutes />}</NavigationContainer>;
};
