"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, X } from "lucide-react"
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: "1",
            content: "Hello! How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        // Listen for bot responses
        socket.on("botResponse", (data) => {
            const botMessage = {
                id: (Date.now() + 1).toString(),
                content: JSON.stringify(data, null, 2),
                sender: "bot",
                timestamp: new Date(),
            }
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false)
        });
    
        return () => socket.off("botResponse");
    }, []);

    const handleSendMessage = () => {
        if (inputValue.trim() === "") return

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "user",
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, userMessage])
        setInputValue("")

        // Simulate bot typing
        socket.emit("userQuery", inputValue);
        setIsTyping(true)
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <>
        {isOpen ? 
            <div className="flex flex-col h-11/12 max-w-md mx-auto border solid rounded-lg fixed bottom-5 right-5">
                {/* Header */}
                <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Bot className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">ChatBot</h1>
                        <p className="text-xs text-gray-500">Online | Usually responds in a few minutes</p>
                    </div>
                    <button className="p-5 rounded-full cursor-pointer hover:bg-black/5" onClick={() => setIsOpen(false)}>
                        <X />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                    message.sender === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white border rounded-tl-none shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-center mb-1">
                                        {message.sender === "bot" && <Bot className="h-4 w-4 mr-1 text-blue-600" />}
                                        {message.sender === "user" && <User className="h-4 w-4 mr-1 text-white" />}
                                        <span className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                                            {message.sender === "user" ? "You" : "ChatBot"} • {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                                    <div className="flex items-center">
                                        <Bot className="h-4 w-4 mr-1 text-blue-600" />
                                        <span className="text-xs text-gray-500">ChatBot is typing</span>
                                    </div>
                                    <div className="flex space-x-1 mt-1">
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                                            style={{ animationDelay: "0ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                                            style={{ animationDelay: "150ms" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                                            style={{ animationDelay: "300ms" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t bg-white rounded-lg">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSendMessage()
                                }
                            }}
                            placeholder="Type your message..."
                            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={inputValue.trim() === "" || isTyping}
                            className={`ml-2 p-2 rounded-full cursor-pointer ${
                            inputValue.trim() === "" || isTyping
                                ? "bg-gray-200 text-gray-400"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            } transition-colors`}
                        >
                            {isTyping ? <Loader2 className="h-5 w-5 animate-spin cursor-pointer" /> : <Send className="h-5 w-5 cursor-pointer" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        ChatBot may produce inaccurate information about people, places, or facts.
                    </p>
                </div>
            </div>
        
        : <button onClick={() => setIsOpen(true)} className="fixed bottom-10 right-10 cursor-pointer bg-white p-5 rounded-full shadow-lg">
            <Bot className="h-10 w-10 text-blue-600 border " />
        </button>}
        </>
    )
}

