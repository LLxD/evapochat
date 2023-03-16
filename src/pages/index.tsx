import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const mutation = api.message.createMessage.useMutation();
  const addMessage = () => {
    mutation.mutate({ text: "Hello from T3!" });
  };

  const getAllMessages = () => {
    const { data, error } = api.message.getAll.useQuery();
    if (error) {
      return <div>Something went wrong!</div>;
    }
    if (!data) {
      return <div>Loading...</div>;
    }
    return (
      <ul>
        {data.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    );
  };
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-4xl font-bold text-white">Welcome to T3!</h1>
        {getAllMessages()}
        <button onClick={() => addMessage()}>Add a new message!</button>
      </main>
    </>
  );
};

export default Home;
