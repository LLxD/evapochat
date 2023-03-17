import { type NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [randomNum, setRandomNum] = useState(0);
  const mutation = api.message.createMessage.useMutation();
  const createMessage = (message: string) => {
    mutation.mutate({ text: message, randomColor: randomNum });
  };

  const chat = useRef<HTMLDivElement>(null);

  const autoScrollToBottom = () => {
    chat.current?.scrollTo({
      top: chat.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const addMessageToChat = (message: string) => {
    createMessage(message);
    setMessage("");
  };

  useEffect(() => {
    setRandomNum(Math.random());
  }, []);

  const { data } = api.message.getAll.useQuery(undefined, {
    refetchInterval: 200,
    onSuccess: () => {
      autoScrollToBottom();
    },
  });

  const [message, setMessage] = useState("");

  return (
    <>
      <Head>
        <title>evapochat</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col justify-center bg-[#111] lg:items-center">
        <div className="grid gap-2 rounded p-4 px-12 lg:w-[512px] ">
          <h1 className="font-mono text-4xl font-bold text-orange-500">
            evapochat
          </h1>
          <div ref={chat} className="h-96 overflow-y-auto py-4">
            <div className="flex items-center gap-4">
              <span className={`h-4 w-4 rounded-full bg-green-500`}></span>
              <p key={1} className="py-3 text-white">
                Welcome to evapochat
              </p>
            </div>
            {data?.map((message, index) => {
              return (
                <div className="flex items-center gap-4">
                  {data[index - 1]?.randomColor !== message.randomColor ? (
                    <span
                      className={`h-4 w-4 rounded-full ${message.randomColor}`}
                    ></span>
                  ) : (
                    <span
                      className={`h-4 w-4 rounded-full bg-transparent`}
                    ></span>
                  )}

                  <p key={message.id} className="py-3 text-white">
                    {message.text}
                  </p>
                </div>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMessageToChat(message);
            }}
            className="grid gap-2"
          >
            <input
              value={message}
              className="border-2 border-orange-500 bg-transparent p-4 text-white outline-none "
              onChange={(e) => setMessage(e.target.value)}
            ></input>
            <button
              onClick={() => {
                addMessageToChat(message);
              }}
              type="button"
              className="rounded border-2 border-orange-500 p-2 text-orange-500 transition-colors hover:bg-orange-900"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
