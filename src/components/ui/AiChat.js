import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const AiChat = ({ data, className, isError }) => {
    const [copiedCode, setCopiedCode] = useState(null);
    const [toggleReasoning, setToggleReasoning] = useState(false);

    const copyToClipboard = (code, language) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(language);
        setTimeout(() => setCopiedCode(null), 1000);
    };

    // Handle both object responses and string error messages
    const isStringResponse = typeof data === 'string';
    const responseData = isStringResponse ? { content: data } : data?.choices?.[0]?.message;
    
    return (
        <div className="flex gap-3 py-4 ">
            <div className="min-w-8 h-8 grid place-items-center text-white rounded-full border border-blue-800 bg-blue-600 shrink-0">
                DQ
            </div>

            <div className="flex-1 min-w-0 space-y-3">
                {/* Response Time & Toggle Reasoning - Always shown */}
                <div className=" max-w-none w-full">
                    <div className={`px-3 py-1 rounded-full ${className} text-sm w-fit flex items-center gap-3 cursor-pointer`}
                        onClick={() => setToggleReasoning(!toggleReasoning)}>
                        <div>
                            Generated in {data?.responseTime ? Math.round(data.responseTime / 1000) + "s" : "0s"}
                        </div>
                        <button className="py-1 rounded text-xs transition">
                            {toggleReasoning ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                    </div>

                    {/* Reasoning Section (only for successful responses) */}
                    {!isStringResponse && toggleReasoning && responseData?.reasoning && (
                        <div className="flex gap-4 mt-3 max-w-none w-full overflow-hidden">
                            <div className="bg-slate-600 w-[0.2px] my-5 shrink-0"></div>
                            <div className="  max-w-none w-full text-slate-600 break-words min-w-0">
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => (
                                            <p className="my-4 leading-relaxed whitespace-pre-wrap" {...props} />
                                        ),
                                    }}
                                >
                                    {responseData.reasoning}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className={`prose prose-slate max-w-none w-full break-words ${isError ? 'text-red-500' : ''}`}>
                    {isStringResponse ? (
                        // Plain text error message
                        <div className="my-4 leading-relaxed">
                            {responseData.content}
                        </div>
                    ) : (
                        // Regular Markdown content
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => (
                                    <p className="my-4 leading-relaxed" {...props} />
                                ),
                                h1: ({ node, ...props }) => (
                                    <h1 className="text-2xl font-bold text-slate-600 mb-4 mt-6" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className="text-xl font-semibold text-slate-600 mb-3 mt-5" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-lg font-medium text-slate-600 mb-2 mt-4" {...props} />
                                ),
                                code({ inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const codeText = String(children).replace(/\n$/, "");

                                    return !inline && match ? (
                                        <div className="relative w-full min-w-0 my-4 rounded-lg">
                                            <div className="flex justify-between items-center bg-gray-800 text-white text-xs px-4 py-2 rounded-t-lg">
                                                <span>{match[1]}</span>
                                                <button
                                                    onClick={() => copyToClipboard(codeText, match[1])}
                                                    className="text-gray-300 hover:text-white"
                                                >
                                                    {copiedCode === match[1] ? "Copied!" : "Copy"}
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto rounded-b-lg">
                                                <SyntaxHighlighter
                                                    style={dracula}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    className="p-4 text-sm whitespace-pre max-w-full"
                                                    {...props}
                                                >
                                                    {codeText}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>
                                    ) : (
                                        <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono break-words">
                                            {children}
                                        </code>
                                    );
                                },
                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                    <li className="my-2" {...props} />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-blue-300 pl-4 text-slate-600 my-4" {...props} />
                                ),
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-4">
                                        <table className="min-w-full border-collapse" {...props} />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th className="bg-blue-50 text-left px-4 py-2 border-b-2 border-blue-200" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                    <td className="px-4 py-2 border-b border-blue-100" {...props} />
                                ),
                            }}
                        >
                            {responseData?.content || "Content not available"}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiChat;