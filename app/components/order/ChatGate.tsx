import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWorstSendButton } from "./hooks/useWorstSendButton";

type ConversationNode = {
  botMessage: string;
  options: string[];
  correctIndex: number;
};

type ChatGateProps = {
  flow: ConversationNode[];
  onComplete: () => void;
  worstUIEnabled: boolean;
  testMode: boolean;
};

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const FAILURE_RESPONSES = ["申し訳ございません。もう一度お聞かせください。"];
const BOT_RESPONSE_DELAY = 1500;

function pickFlowNodes(flow: ConversationNode[], count: number) {
  if (flow.length <= count) return flow;
  const target = Math.min(count, flow.length);
  const selected = new Set<number>([0]);
  const candidates = flow.map((_, index) => index).slice(1);

  while (selected.size < target && candidates.length > 0) {
    const weights = candidates.map((index) => 1 / (index + 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let threshold = Math.random() * totalWeight;
    let chosen = candidates[0];
    for (let i = 0; i < candidates.length; i += 1) {
      threshold -= weights[i];
      if (threshold <= 0) {
        chosen = candidates[i];
        break;
      }
    }
    selected.add(chosen);
    const removalIndex = candidates.indexOf(chosen);
    candidates.splice(removalIndex, 1);
  }

  return Array.from(selected)
    .sort((a, b) => a - b)
    .map((index) => flow[index]);
}

export default function ChatGate({
  flow,
  onComplete,
  worstUIEnabled,
  testMode,
}: ChatGateProps) {
  const selectedFlow = useMemo(() => pickFlowNodes(flow, 6), [flow]);
  const effectiveFlow = useMemo(
    () => (testMode ? selectedFlow.slice(0, 1) : selectedFlow),
    [selectedFlow, testMode],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(() =>
    effectiveFlow.length > 0
      ? [
          {
            id: "bot-0",
            sender: "bot",
            text: effectiveFlow[0].botMessage,
          },
        ]
      : [],
  );
  const { containerRef, buttonRef, relocate, resetPosition, style } =
    useWorstSendButton(worstUIEnabled);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const botTimeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const currentNode = effectiveFlow[currentIndex];

  const clearBotTimeouts = useCallback(() => {
    for (const timeoutId of botTimeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    botTimeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
      clearBotTimeouts();
    };
  }, [clearBotTimeouts]);

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    clearBotTimeouts();
    resetPosition();
    setCurrentIndex(0);
    setSelectedOption(null);
    setMessages(
      effectiveFlow.length > 0
        ? [
            {
              id: "bot-0",
              sender: "bot",
              text: effectiveFlow[0].botMessage,
            },
          ]
        : [],
    );
  }, [effectiveFlow, resetPosition, clearBotTimeouts]);

  const scheduleBotResponse = useCallback(
    (message: Message, onAfter?: () => void) => {
      const timeoutId = setTimeout(() => {
        setMessages((prev) => [...prev, message]);
        if (onAfter) onAfter();
        botTimeoutsRef.current = botTimeoutsRef.current.filter(
          (pending) => pending !== timeoutId,
        );
      }, BOT_RESPONSE_DELAY);
      botTimeoutsRef.current.push(timeoutId);
    },
    [],
  );

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedOption === null || !currentNode) return;

    const selectedText = currentNode.options[selectedOption];
    const isCorrect = selectedOption === currentNode.correctIndex;
    const isLast = currentIndex === effectiveFlow.length - 1;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${currentIndex}-${selectedOption}`,
        sender: "user",
        text: selectedText,
      },
    ]);

    if (isCorrect) {
      resetPosition();
      setSelectedOption(null);
      if (isLast) {
        scheduleBotResponse(
          {
            id: "bot-final",
            sender: "bot",
            text: "ご協力ありがとうございました！インターネット接続を確認します。",
          },
          () => {
            completionTimeoutRef.current = setTimeout(() => {
              onComplete();
            }, 600);
          },
        );
      } else {
        const nextIndex = Math.min(currentIndex + 1, effectiveFlow.length - 1);
        scheduleBotResponse(
          {
            id: `bot-${nextIndex}`,
            sender: "bot",
            text: effectiveFlow[nextIndex].botMessage,
          },
          () => {
            setCurrentIndex(nextIndex);
          },
        );
      }
    } else {
      const failureResponse =
        FAILURE_RESPONSES[Math.floor(Math.random() * FAILURE_RESPONSES.length)];
      scheduleBotResponse({
        id: `bot-retry-${Date.now()}`,
        sender: "bot",
        text: failureResponse,
      });
      relocate();
    }
  };

  return (
    <section className="mt-4 flex flex-1 flex-col">
      <div className="mt-4 flex flex-1 flex-col overflow-hidden border border-gray-200 bg-white">
        <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${
                message.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 text-sm leading-relaxed ${
                  message.sender === "bot"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form
          onSubmit={handleSend}
          className="border-t border-gray-200 dark:border-gray-700"
        >
          <div
            ref={containerRef}
            className="relative min-h-[200px] bg-gray-50 p-4 dark:bg-gray-950"
          >
            <fieldset className="space-y-2 text-sm">
              {currentNode?.options.map((option, index) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center justify-between border border-gray-200 px-3 py-2 transition active:scale-[0.99] dark:border-gray-700 ${
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
              onMouseEnter={worstUIEnabled ? relocate : undefined}
              onFocus={worstUIEnabled ? relocate : undefined}
              onTouchStart={worstUIEnabled ? relocate : undefined}
              style={style}
              className="flex h-10 min-w-[88px] items-center justify-center bg-blue-600 px-6 text-sm font-semibold text-white shadow transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              送信
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
