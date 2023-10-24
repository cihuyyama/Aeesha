import { OpenAIChatResponse } from "@/model/resModel";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import TypingAnimation from "./TypingAnimation";
import { FaPaperPlane, FaFileDownload } from "react-icons/fa";
import SelectTotalPeople, { frameworks } from "./SelectTotalPeople";
import SelectMainFocus, { framework } from "./SelectMainFocus";
import jsPDF from "jspdf";
import { Button } from "./ui/button";

const ChatViews = () => {
  const [inputValue, setInputValue] = useState("");
  const [valuePeople, setValuePeople] = useState("");
  const [valueFocus, setValueFocus] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [isSelecting2, setIsSelecting2] = useState(false);
  const [city, setCity] = useState("");
  const [chatlog, setChatlog] = useState<
    { type: string; message: string | JSX.Element }[]
  >([
    {
      type: "bot",
      message:
        "Halo saya adalah AutoSPBE,\n Kami dapat membantu anda membuat Masterplan Smart City. Apa nama Kota anda ?",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChatlog((prevChatLog) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    if (inputValue.toLowerCase().includes("bantul")) {
      setCity("bantul");
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "bot",
          message: "Berapa jumlah penduduk bantul ?",
        },
      ]);
      setIsSelecting(true);
    } else {
      sendMessage(inputValue);
    }

    setInputValue("");
  };

  useEffect(() => {
    if (valuePeople) {
      setIsSelecting(false);
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "user",
          message: `${
            valuePeople
              ? frameworks.find((framework) => framework.value === valuePeople)
                  ?.label
              : "Pilih jumlah penduduk"
          }`,
        },
      ]);
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "bot",
          message: "Apa fokus utama smart city di kota bantul ?",
        },
      ]);
      setIsSelecting2(true);
    }
  }, [valuePeople]);

  useEffect(() => {
    if (valueFocus) {
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "user",
          message: `${
            valueFocus
              ? framework.find((framework) => framework.value === valueFocus)
                  ?.label
              : "Pilih fokus utama"
          }`,
        },
      ]);
      setIsSelecting2(false);
    }
  }, [valueFocus]);

  useEffect(() => {
    if (valueFocus && valuePeople) {
      setChatlog((prevChatLog) => [
        ...prevChatLog,
        {
          type: "bot",
          message: `Silahkan unduh file PDF dibawah ini`,
        },
      ]);
      setIsSelecting2(false);
    }
  }, [valueFocus, valuePeople]);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(`${framework.find((framework) => framework.value === valueFocus)?.label} dikota ${city}`, 10, 10);
    doc.save(`${framework.find((framework) => framework.value === valueFocus)?.label} dikota ${city}`)
    doc.output("dataurlnewwindow");
  };

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);

      const url = `${
        process.env.NODE_ENV === "development" ? "http://localhost:5000" : ""
      }/api/chat/load`;
      const openaiURL = "https://api.openai.com/v1/chat/completions";
      const data = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      };
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_API_KEY}`,
      };
      const res: AxiosResponse<OpenAIChatResponse> = await axios.post(
        openaiURL,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto my-auto min-h-screen bg-white ">
      <div className="container mx-auto max-w-[700px]">
        <div className="flex flex-col min-h-screen bg-[url(https://i.pinimg.com/564x/ca/d7/6d/cad76d75091745f0636572ff0cc027ad.jpg)] border-x-4 border-gray-300 ">
          <div className="max-h-[300px] my-2 mx-2 bg-lime-600">
            <h1 className="text-white text-transparent bg-clip-text text-center py-3 font-bold text-base">
              AutoSPBE AI
              <br />
              Aplikasi Pembuatan Master Plan Smart City Otomatis V.0.1
            </h1>
          </div>
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
                      message.type === "user" ? "bg-lime-400" : "bg-lime-100"
                    } rounded-lg p-4 text-black max-w-xl `}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div key={chatlog.length} className="flex justify-start">
                  <div className="bg-lime-100 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
                </div>
              )}
              {isSelecting && (
                <div className="flex justify-end">
                  <SelectTotalPeople
                    myVar={valuePeople}
                    setMyVar={setValuePeople}
                  />
                </div>
              )}
              {isSelecting2 ? (
                <div className="flex justify-end">
                  <SelectMainFocus
                    myVar={valueFocus}
                    setMyVar={setValueFocus}
                  />
                </div>
              ) : (
                <></>
              )}
              {valueFocus && valuePeople ? (
                <div className="flex justify-start">
                  <Button onClick={generatePdf} className=" bg-lime-100 text-black hover:text-white">
                    {`${framework.find((framework) => framework.value === valueFocus)?.label} di kota ${city}.pdf`}
                    <FaFileDownload className="ml-2 h-4 w-4 shrink-0" />
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex-none p-6">
            <div className="flex rounded-lg bg-white ">
              <input
                className="flex-grow px-4 py-2 bg-transparent text-black focus:outline-none"
                type="text"
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="my-2 mx-2 bg-lime-600 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                type="submit"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatViews;
