import React, { useCallback, useState } from "react";
import { Icon, VStack, FlatList } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PollCard, PollCardProps } from "../components/PollCard";
import { Loading } from "../components/Loading";
import { EmptyPollList } from "../components/EmptyPollList";
import { api } from "../services/api";

export function Polls() {
  const { navigate } = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [pollsList, setPollsList] = useState<PollCardProps[]>([]);

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const res = await api.get("/polls");

      setPollsList(res.data.polls);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          text="Entrar em um novo bolão"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate("join")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          px={5}
          _contentContainerStyle={{ pb: 10 }}
          data={pollsList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard data={item} onPress={() => navigate("details", { id: item.id })} />
          )}
          ListEmptyComponent={() => <EmptyPollList />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}
