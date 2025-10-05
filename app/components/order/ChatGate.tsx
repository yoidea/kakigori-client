import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWorstSendButton } from "./hooks/useWorstSendButton";

type ConversationNode = {
  botMessage: string;
  options: string[];
  correctIndex: number;
};

type ChatGateProps = {
  flow: ConversationNode[];
  onComplete: () => void;
};

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const FAILURE_MESSAGES = [
  "違います。もっと心で感じてください。",
  "惜しいですね。正解を見つけてから押してください。",
  "まだです。真実はどこかにあります。",
];

export default function ChatGate({ flow, onComplete }: ChatGateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(() =>
    flow.length > 0
      ? [
          {
            id: "bot-0",
            sender: "bot",
            text: flow[0].botMessage,
          },
        ]
      : [],
  );
  const { containerRef, buttonRef, relocate, resetPosition, style } =
    useWorstSendButton();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const currentNode = flow[currentIndex];

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const failureMessage = useMemo(
    () => FAILURE_MESSAGES[currentIndex % FAILURE_MESSAGES.length],
    [currentIndex],
  );

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedOption === null || !currentNode) return;

    const selectedText = currentNode.options[selectedOption];
    const isCorrect = selectedOption === currentNode.correctIndex;
    const isLast = currentIndex === flow.length - 1;

    setMessages((prev) => {
      const nextMessages: Message[] = [
        ...prev,
        {
          id: `user-${currentIndex}-${selectedOption}`,
          sender: "user",
          text: selectedText,
        },
      ];

      if (isCorrect) {
        if (isLast) {
          nextMessages.push({
            id: "bot-final",
            sender: "bot",
            text: "……しょうがないですね。進んでください。",
          });
        } else {
          nextMessages.push({
            id: `bot-${currentIndex + 1}`,
            sender: "bot",
            text: flow[currentIndex + 1].botMessage,
          });
        }
      } else {
        nextMessages.push({
          id: `bot-retry-${Date.now()}`,
          sender: "bot",
          text: failureMessage,
        });
      }
      return nextMessages;
    });

    if (isCorrect) {
      resetPosition();
      setSelectedOption(null);
      if (isLast) {
        completionTimeoutRef.current = setTimeout(() => {
          onComplete();
        }, 600);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, flow.length - 1));
      }
    } else {
      relocate();
    }
  };

  return (
    <section className="mt-4 flex flex-1 flex-col">
      <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
        チャットに全て正しく答えないと先に進めません
      </p>
      <div className="mt-4 flex flex-1 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  message.sender === "bot"
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700">
          <div
            ref={containerRef}
            className="relative min-h-[200px] rounded-b-3xl bg-gray-50 p-4 dark:bg-gray-950"
          >
            <fieldset className="space-y-2 text-sm">
              {currentNode?.options.map((option, index) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 px-3 py-2 transition active:scale-[0.99] dark:border-gray-700 ${
                    selectedOption === index
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <span>{option}</span>
                  <input
                    type="radio"
                    className="h-4 w-4"
                    name="chat-option"
                    value={index}
                    checked={selectedOption === index}
                    onChange={() => setSelectedOption(index)}
                  />
                </label>
              ))}
            </fieldset>
            <button
              ref={buttonRef}
              type="submit"
              disabled={selectedOption === null}
              onMouseEnter={relocate}
              onFocus={relocate}
              onTouchStart={relocate}
              style={style}
              className="flex h-10 min-w-[88px] items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
