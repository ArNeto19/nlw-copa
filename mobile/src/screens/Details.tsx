import { useCallback, useState } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { Header } from "../components/Header";
import { PollHeader } from "../components/PollHeader";
import { PollCardProps } from "../components/PollCard";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export const Details = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pollDetails, setPollDetails] = useState<PollCardProps | null>({} as PollCardProps);
  const [selectedOption, setSelectedOption] = useState<"guesses" | "ranking">("guesses");
  const route = useRoute();
  const toast = useToast();
  const { id } = route.params as RouteParams;

  const fetchPollDetails = async () => {
    try {
      setIsLoading(true);

      const res = await api.get(`/polls/${id}`);

      setPollDetails(res.data.poll);
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Não foi possível carregar as informações do bolão",
        placement: "top",
        color: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareCode = async () => {
    await Share.share({
      message: pollDetails.code,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchPollDetails();
    }, [id])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={pollDetails.title} showBackButton showShareButton onShare={shareCode} />

      {pollDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PollHeader data={pollDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === "guesses"}
              onPress={() => setSelectedOption("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === "ranking"}
              onPress={() => setSelectedOption("ranking")}
            />
          </HStack>

          <Guesses pollId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPollList code={pollDetails.code} />
      )}
    </VStack>
  );
};
