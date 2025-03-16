import { useRef, useState, useEffect } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { IoArrowUpOutline } from "react-icons/io5";
import { FaSquareFull } from "react-icons/fa6";
import AiChat from "./ui/AiChat";
import UserChat from "./ui/UserChat";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import HashLoader from "react-spinners/HashLoader";
import "../App.css";

export default function DeepSeekChat() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef();
  const [toggleTheme, setToggleTheme] = useState(false);
  const abortControllerRef = useRef(null);

  const theme = {
    dark: {
      base: "bg-gray-900 text-white",
      hightlight1: " bg-gray-700 text-white",
      placeholder: "placeholder:text-slate-300"
    },
    light: {
      base: "bg-slate-100 text-slate-800",
      hightlight1: " bg-blue-200 text-blue-900",
      placeholder: "placeholder:text-slate-700"
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);

    setConversation(prev => [...prev, { user: query, ai: null }]);
    setQuery("");

    try {
      const res = await fetch("https://aichat-integrate-2.onrender.com/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Server responded with error');
      }

      const data = await res.json();
      
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1].ai = data;
        return newConv;
      });
    } catch (error) {
      setConversation(prev => {
        const newConv = [...prev];
        const lastIndex = newConv.length - 1;
        
        const isAborted = error.name === 'AbortError' || 
                         error.message.includes('abort') || 
                         controller.signal.aborted;

        newConv[lastIndex].ai = isAborted 
          ? "Response stopped by user" 
          : error.message || "Error fetching response";

        return newConv;
      });
    } finally {
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${toggleTheme ? theme.light.base : theme.dark.base}`}>
      <div className="flex justify-between items-center px-4 py-4 w-full">
        <h2 className="text-xl font-bold">DeepSeek AI Chat</h2>
        <div className="cursor-pointer mr-2" onClick={() => setToggleTheme(!toggleTheme)}>
          {toggleTheme ? <MdDarkMode /> : <MdLightMode />}
        </div>
      </div>

      <div className="flex w-full min-h-32 overflow-y-auto custom-scrollbar p-4">
        <div className="mx-auto max-w-4xl w-full">
          <div className="space-y-8">
            {conversation.map((entry, index) => (
              <div key={index} className="py-1">
                <UserChat data={entry.user} />
                {!entry.ai ? (
                  <div className="flex gap-3 py-4">
                    <div className="min-w-8 h-8 grid place-items-center text-white rounded-full border border-blue-800 bg-blue-600 shrink-0">
                      DS
                    </div>
                    <div className={`px-3 py-1 rounded-full ${toggleTheme ? theme.light.hightlight1 : theme.dark.hightlight1} text-sm w-fit flex items-center gap-2 cursor-pointer`}>
                      <div>thinking..</div>
                      <HashLoader
                        loading={true}
                        color="#1E88E5"
                        size={12}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </div>
                ) : (
                  <AiChat 
                    data={entry.ai} 
                    className={`${toggleTheme ? theme.light.hightlight1 : theme.dark.hightlight1}`}
                    isError={typeof entry.ai === 'string' && (
                      entry.ai.startsWith("Response stopped") || 
                      entry.ai.startsWith("Error") ||
                      entry.ai.startsWith("Server responded")
                    )}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="">
        <div className="mx-auto max-w-4xl w-full p-4">
          {conversation.length === 0 && (
            <div className="mb-4 text-center text-2xl font-bold">
              How can I help you?
            </div>
          )}
          <form onSubmit={handleSend} className={`flex py-4 px-4 rounded-2xl ${toggleTheme ? theme.light.hightlight1 : theme.dark.hightlight1}`}>
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something..."
              className={`${toggleTheme ? theme.light.hightlight1 + " " + theme.light.placeholder : theme.dark.hightlight1 + " " + theme.dark.placeholder}`}
            />
            <Button
              type={loading ? "button" : "submit"}
              onClick={loading ? handleStop : undefined}
              className={`${query === "" ? "bg-blue-500" : ""}`}
            >
              {loading ? <FaSquareFull /> : <IoArrowUpOutline />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}