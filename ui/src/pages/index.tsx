import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";

interface HomeProps {
  usersCount: number;
  poolCount: number;
  guessCount: number;
}

export default function Home(props: HomeProps): any {
  const [poolTitle, setPoolTitle] = useState<string>("");

  const handleChange = (event: any) => {
    let { value } = event.target;

    setPoolTitle(value);
  };

  const createPool = async (event: FormEvent) => {
    event.preventDefault;

    try {
      const res = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = res.data;
    } catch (err) {
      console.log(err);
      alert("Falha ao criar bolão! Tente novamente em instantes.");
    }
  };

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="#" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da Copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="#" />
          <strong>
            <span className="text-emerald-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            required
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600"
            type="text"
            name="poolTitle"
            value={poolTitle}
            placeholder="Qual o nome do seu bolão?"
            onChange={handleChange}
          />
          <button
            className="bg-yellow-300 hover:bg-yellow-400 text-gray-600 px-6 py-4 rounded font-bold"
            type="submit">
            CRIAR MEU BOLÃO
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-800 grid grid-cols-2">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="#" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="#" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">{props.guessCount}</span>
              <span>Palpites registrados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="#" quality={100} />
    </div>
  );
}

export const getServerSideProps = async () => {
  const [userCountResponse, poolCountResponse, guessCountResponse] = await Promise.all([
    api.get("/users/count"),
    api.get("/pools/count"),
    api.get("/guesses/count"),
  ]);

  return {
    props: {
      userCount: userCountResponse.data.count,
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
    },
  };
};
