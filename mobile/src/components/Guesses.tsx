import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, useToast } from "native-base";
import { Game, GameProps } from "./Game";
import { api } from "../services/api";
import { Loading } from "./Loading";
import { EmptyMyPollList } from "./EmptyMyPollList";

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  const fetchGames = async () => {
    try {
      setIsLoading(true);

      const res = await api.get(`/polls/${pollId}/games`);
     
      setGames(res.data.games);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível carregar as informações dos jogos",
        placement: "top",
        color: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmGuess = async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do jogo para confirmar o palpite.",
          placement: "top",
          color: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite confirmado com sucesso.",
        placement: "top",
        color: "green.500",
      });

      fetchGames();
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível confirmar seu palpite.",
        placement: "top",
        color: "red.500",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [pollId])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => confirmGuess(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
