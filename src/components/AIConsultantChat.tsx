import React, { useState, useRef, useEffect } from "react";
import { 
  BotMessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Layers, 
  RefreshCw, 
  HelpCircle,
  Sprout,
  ShieldCheck,
  Zap,
  RotateCcw
} from "lucide-react";
import { GardenProfile, ChatMessage } from "../types";

interface AIConsultantChatProps {
  garden: GardenProfile;
}

const QUICK_QUESTIONS = [
  "Thời điểm bón phân làm đọt sầu riêng trên đất đỏ Bazan?",
  "Cách nâng pH đất vườn từ 5.4 lên 6.2 không sốc rễ?",
  "Phòng ngừa xì mủ Phytophthora và thán thư mùa mưa?",
  "Tỷ lệ pha nấm Trichoderma + Humic tưới gốc chuẩn?",
  "Xử lý bọ trĩ và rầy xanh kháng thuốc bằng sinh học?"
];

export const AIConsultantChat: React.FC<AIConsultantChatProps> = ({ garden }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Dạ chào Bác/chú làm vườn **${garden.ownerName || garden.name}**! Tôi là **Bác Sĩ Nông Y AI**, được thiết lập riêng theo điều kiện **${garden.soilType}** và hệ thống **${garden.irrigationType}** tại **${garden.location}** của nhà vườn mình.

Bác đang cần tư vấn về vấn đề gì trên cây trồng hôm nay ạ? (Kỹ thuật cơi đọt, phòng trừ sâu bệnh, xử lý rễ đất hay liều lượng phân bón...)`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlotId, setSelectedPlotId] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    const activePlot = garden.plots.find((p) => p.id === selectedPlotId);

    try {
      const res = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          gardenInfo: {
            name: garden.name,
            ownerName: garden.ownerName,
            location: garden.location,
            soilType: garden.soilType,
            irrigationType: garden.irrigationType,
            cultivationStandard: garden.cultivationStandard
          },
          activePlot
        })
      });

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "Dạ, hệ thống đang tính toán lại câu trả lời cho vườn.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Dạ tạm thời đường truyền kết nối AI bị gián đoạn, Bác vui lòng thử lại sau giây lát ạ.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-fresh",
        role: "assistant",
        content: `Đã làm mới cuộc hội thoại. Tôi sẵn sàng giải đáp bất kỳ thắc mắc kỹ thuật nào cho **${garden.name}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Bento Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F3E8] text-[#2D5A27] text-xs font-bold mb-2 border border-emerald-200">
            <BotMessageSquare className="w-3.5 h-3.5 text-[#2D5A27]" />
            <span>Chuyên Gia Nông Y Cá Nhân Hoá</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cố Vấn Kỹ Thuật Trực Tuyến
          </h1>
          <p className="text-xs sm:text-sm text-[#527050] mt-1">
            Phản hồi có kiến thức chuyên sâu về chất đất <strong className="text-[#2D5A27]">{garden.soilType}</strong> và tiêu chuẩn <strong className="text-[#2D5A27]">{garden.cultivationStandard}</strong>.
          </p>
        </div>

        {/* Plot Context Selector & Reset */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={selectedPlotId}
            onChange={(e) => setSelectedPlotId(e.target.value)}
            className="bg-[#F9FBF9] border border-[#E2ECE2] text-xs text-slate-700 font-semibold px-3.5 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] cursor-pointer"
          >
            <option value="all">Bối cảnh: Toàn vườn</option>
            {garden.plots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.cropName})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearChat}
            className="p-2.5 text-slate-400 hover:text-[#2D5A27] rounded-2xl hover:bg-[#E8F3E8] transition border border-[#E2ECE2] cursor-pointer"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Bento Container */}
      <div className="bg-white rounded-3xl border border-[#E2ECE2] shadow-[0_4px_20px_-4px_rgba(45,90,39,0.06)] flex flex-col h-[580px] overflow-hidden">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FDFEFE]">
          {messages.map((msg) => {
            const isAi = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs sm:text-sm ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <div className="w-9 h-9 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Sprout className="w-4 h-4 text-[#A3D99E]" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-3xl p-4 sm:p-5 shadow-sm space-y-1.5 ${
                    isAi
                      ? "bg-[#F9FBF9] text-slate-800 border border-[#E2ECE2]"
                      : "bg-[#2D5A27] text-white"
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>
                  <div
                    className={`text-[10px] text-right ${
                      isAi ? "text-[#739270]" : "text-[#A3D99E]"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-9 h-9 rounded-2xl bg-[#162e13] text-[#A3D99E] flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-[#2D5A27]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start text-xs sm:text-sm">
              <div className="w-9 h-9 rounded-2xl bg-[#2D5A27] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#A3D99E] animate-spin" />
              </div>
              <div className="bg-[#F9FBF9] border border-[#E2ECE2] rounded-3xl p-4 text-[#527050] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#2D5A27] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-[#739270] ml-1">Bác Sĩ Nông Y đang phân tích chất đất và phác đồ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-[#F4F9F4] border-t border-[#E2ECE2] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-[#527050] whitespace-nowrap flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Gợi ý:
          </span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-xs px-3 py-1.5 bg-white hover:bg-[#E8F3E8] hover:text-[#2D5A27] text-slate-700 rounded-xl border border-[#E2ECE2] whitespace-nowrap transition cursor-pointer font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-[#E2ECE2] flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Hỏi về sâu bệnh, liều lượng pha phân bón, đo pH đất, kỹ thuật cơi đọt..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#F9FBF9] border border-[#E2ECE2] rounded-2xl outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 bg-[#2D5A27] hover:bg-[#1E3F1A] disabled:opacity-40 text-white rounded-2xl shadow-sm transition shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
