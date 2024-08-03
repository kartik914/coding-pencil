"use client";

import Navbar from "@/components/navbar/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeMirror from "@uiw/react-codemirror";
import { html as HTML } from "@codemirror/lang-html";
import { css as CSS } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { useEffect, useState } from "react";
import { createTheme } from "@uiw/codemirror-themes";
import { FaCss3Alt, FaHtml5 } from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";
import { CiCircleChevDown } from "react-icons/ci";
import { tags as t } from "@lezer/highlight";

export default function Project() {
  const [html, setHtml] = useState("");
  const [css, setCSS] = useState(`* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
  `);
  const [js, setJS] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [sameOwner, setSameOwner] = useState(true);
  const [showOutput, setShowOutput] = useState(true);

  const myTheme = createTheme({
    theme: "dark",
    settings: {
      foreground: "#d4d4d4",
      gutterBackground: "#163042",
      fontFamily: "Cascadia Code",
      background: "#193549",
      lineHighlight: "#8a91991a",
      selection: "#21549a",
      selectionMatch: "#133c60",
    },
    styles: [
      {
        tag: [
          t.keyword,
          t.operatorKeyword,
          t.modifier,
          t.color,
          t.constant(t.name),
          t.standard(t.name),
          t.standard(t.tagName),
          t.special(t.brace),
          t.atom,
          t.bool,
          t.special(t.variableName),
        ],
        color: "#569cd6",
      },
      { tag: [t.controlKeyword, t.moduleKeyword], color: "#c586c0" },
      {
        tag: [
          t.name,
          t.deleted,
          t.character,
          t.macroName,
          t.propertyName,
          t.variableName,
          t.labelName,
          t.definition(t.name),
        ],
        color: "#9cdcfe",
      },
      { tag: t.heading, fontWeight: "bold", color: "#9cdcfe" },
      {
        tag: [
          t.typeName,
          t.className,
          t.tagName,
          t.number,
          t.changed,
          t.annotation,
          t.self,
          t.namespace,
        ],
        color: "#4ec9b0",
      },
      {
        tag: [t.function(t.variableName), t.function(t.propertyName)],
        color: "#dcdcaa",
      },
      { tag: [t.number], color: "#b5cea8" },
      {
        tag: [
          t.operator,
          t.punctuation,
          t.separator,
          t.url,
          t.escape,
          t.regexp,
        ],
        color: "#d4d4d4",
      },
      { tag: [t.regexp], color: "#d16969" },
      {
        tag: [
          t.special(t.string),
          t.processingInstruction,
          t.string,
          t.inserted,
        ],
        color: "#ce9178",
      },
      { tag: [t.angleBracket], color: "#808080" },
      { tag: t.strong, fontWeight: "bold" },
      { tag: t.emphasis, fontStyle: "italic" },
      { tag: t.strikethrough, textDecoration: "line-through" },
      { tag: [t.meta, t.comment], color: "#6a9955" },
      { tag: t.link, color: "#6a9955", textDecoration: "underline" },
      { tag: t.invalid, color: "#ff0000" },
    ],
  });

  useEffect(() => {
    const output = `
    <html>
    <head>
    </head>
    <style>
    ${css}
    </style>
    <body>
    ${html}
    <script>${js}</script>
    </body>
    </html>`;
    setOutputCode(output);
  }, [html, css, js]);

  return (
    <main className="min-h-screen h-screen">
      <Navbar></Navbar>
      <div className="w-full h-full pt-12">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel className="min-h-[25vh]">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="min-w-[25vw]">
                <div className="flex flex-col w-full h-full p-1 bg-[#122738]">
                  <div className="flex justify-center items-center gap-2 text-sm w-min p-1 bg-[#193549] text-[#d4d4d4] border-b border-b-[#ffc600]">
                    <FaHtml5 className="text-red-400" />
                    HTML
                  </div>
                  <div className="relative h-full w-full">
                    <CodeMirror
                      extensions={[HTML({ matchClosingTags: true })]}
                      theme={myTheme}
                      editable={sameOwner}
                      height="100%"
                      style={{ scrollbarColor: "green" }}
                      className="absolute top-0 left-0 w-[100%] h-[100%] bg-[#193549]"
                      onChange={(value, viewUpdate) => {
                        setHtml(value);
                      }}
                      value={html}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="min-w-[25vw]">
                <div className="flex flex-col w-full h-full p-1 bg-[#122738]">
                  <div className="flex justify-center items-center gap-2 text-sm w-min p-1 bg-[#193549] text-[#d4d4d4] border-b border-b-[#ffc600]">
                    <FaCss3Alt className="text-blue-400" />
                    CSS
                  </div>
                  <div className="relative h-full w-full">
                    <CodeMirror
                      extensions={[CSS()]}
                      theme={myTheme}
                      editable={sameOwner}
                      height="100%"
                      style={{ scrollbarColor: "green" }}
                      className="absolute top-0 left-0 w-[100%] h-[100%] bg-[#193549]"
                      onChange={(value, viewUpdate) => {
                        setCSS(value);
                      }}
                      value={css}
                    />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel className="min-w-[25vw]">
                <div className="flex flex-col w-full h-full p-1 bg-[#122738]">
                  <div className="flex justify-center items-center gap-2 text-sm w-min p-1 bg-[#193549] text-[#d4d4d4] border-b border-b-[#ffc600]">
                    <RiJavascriptFill className="text-yellow-400" />
                    JS
                  </div>
                  <div className="relative h-full w-full">
                    <CodeMirror
                      extensions={[javascript()]}
                      theme={myTheme}
                      editable={sameOwner}
                      height="100%"
                      style={{ scrollbarColor: "green" }}
                      className="absolute top-0 left-0 w-[100%] h-[100%] bg-[#193549]"
                      onChange={(value, viewUpdate) => {
                        setJS(value);
                      }}
                      value={js}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className={`duration-200 ${
              showOutput ? "relative min-h-[25vh]" : "min-h-0 max-h-0"
            }`}
          >
            <div
              className={`flex p-2 w-min absolute rounded-md right-0 duration-200 m-1 text-white bg-[#122738] ${
                showOutput ? "top-0" : "bottom-0"
              }`}
              onClick={() => setShowOutput(!showOutput)}
            >
              <CiCircleChevDown className={`text-3xl duration-200 ${showOutput ? "rotate-0" : "rotate-180"}`} />
            </div>
            <iframe srcDoc={outputCode} className="h-full w-full" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
