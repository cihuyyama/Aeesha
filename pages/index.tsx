import { NextPage } from "next";

import Head from "next/head";
import LandingPageTemplate from "../templates/LandingPage/LandingPageTemplate";
import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import TypingAnimation from "@/components/TypingAnimation";

const Index: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatlog, setChatlog] = useState<{ type: string; message: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  interface OpenAIChatResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChatlog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);

      const url = "https://api.openai.com/v1/chat/completions";
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
      };
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      };

      const res: AxiosResponse<OpenAIChatResponse> = await axios.post(
        url,
        data,
        { headers: headers }
      );
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        { type: "bot", message: res.data.choices[0].message.content },
      ]);
      console.log(res);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-[700px]">
        <div className="flex flex-col h-screen bg-gray-800 ">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
            Aeesha AI
          </h1>
          <div className="flex-grow p-6">
            <div className="flex flex-col space-y-4">
              {chatlog.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.type === "user" ? "bg-purple-500" : "bg-blue-500"
                    } rounded-lg p-4 text-white max-w-sm `}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {
              isLoading &&
              <div key={chatlog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex-none p-6">
            <div className="flex rounded-lg border border-gray-700 bg-gray-800">
              <input
                className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
                type="text"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button className="bg-blue-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300" type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Index;
