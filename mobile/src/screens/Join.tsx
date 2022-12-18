import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { VStack, Heading, useToast } from "native-base";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Join() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pollCode, setPollCode] = useState<string | null>();

  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (pollCode === undefined || !pollCode.trim()) {
        return toast.show({
          title: "Código inválido.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/polls/join", {
        code: pollCode.toUpperCase(),
      });

      toast.show({
        title: "Você entrou no bolão com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      setPollCode(null);
      navigate("polls");
    } catch (err) {
      console.log(err.response);
      setIsLoading(false);

      if (err.response?.data?.Message === "Poll not find.") {
        return toast.show({
          title: "Bolão não encontrado. Código inválido.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (err.response?.data?.Message === "User already joined this poll") {
        return toast.show({
          title: "Você já faz parte deste bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Algo deu errado. Tente novamente em alguns instantes.",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Entre em um bolão através do código.
        </Heading>

        <Input
          mb={2}
          onChangeText={setPollCode}
          value={pollCode}
          placeholder="Qual o código do seu bolão?"
        />

        <Button onPress={handleJoinPoll} isLoading={isLoading} text="Buscar bolão" />
      </VStack>
    </VStack>
  );
}
