import { useState } from "react";
import { VStack, Heading, useToast } from "native-base";
import Logo from "../assets/logo.svg";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function New() {
  const [pollName, setPollName] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  async function handlePollCreation() {
    if (pollName === undefined || !pollName.trim()) {
      return toast.show({
        title: "Por favor, informe um nome de bolão válido.",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);

      await api.post("/polls", {
        title: pollName,
      });

      toast.show({
        title: "Bolão criado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      setPollName(null);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Ops! Algo deu errado. Tente novamente em alguns instantes.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu próprio bolão e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão?"
          onChangeText={setPollName}
          value={pollName}
        />

        <Button onPress={handlePollCreation} text="Criar meu bolão" isLoading={isLoading} />
      </VStack>
    </VStack>
  );
}
