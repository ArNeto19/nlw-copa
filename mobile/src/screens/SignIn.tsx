import { Center, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { Button } from "../components/Button";
import Logo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center flex={1} bgColor="gray.900">
      {isUserLoading ? (
        <Loading />
      ) : (
        <>
          <Logo width={212} height={40} />
          <Button
            text="ENTRAR COM GOOGLE"
            type="SECONDARY"
            leftIcon={<Icon as={Fontisto} name="google" color="#FFF" size="md" />}
            mt={6}
            onPress={signIn}
            isLoading={isUserLoading}
            _loading={{ _spinner: { color: "#FFF" } }}
          />
        </>
      )}
    </Center>
  );
}
