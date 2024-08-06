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
import { FaCss3Alt, FaHtml5, FaPen, FaSave } from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";
import { CiCircleChevDown } from "react-icons/ci";
import { tags as t } from "@lezer/highlight";
import { useSelector } from "react-redux";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query as firebaseQuery,
  updateDoc,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/app/firebase/firebase.config";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

export default function Project() {
  const user: User = useSelector((state: any) => state.user.user);
  const [project, setProject] = useState<Project>({
    id: "",
    title: "Untitled",
    owner: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
    html: "",
    css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
`,
    js: "",
    private: false,
  });
  const [outputCode, setOutputCode] = useState("");
  const [sameOwner, setSameOwner] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const router = useRouter();

  const projectId = useSearchParams().get("id");

  useEffect(() => {
    const projectQuery = firebaseQuery(
      collection(db, "Projects"),
      where("id", "==", projectId),
      orderBy("id", "desc")
    );

    const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
      const _project = querySnaps.docs.map((doc) => doc.data())[0];
      setProject({
        id: _project.id,
        title: _project.title,
        owner: _project.owner,
        html: _project.html,
        css: _project.css,
        js: _project.js,
        private: _project.private,
      });
      setSameOwner(_project.owner.email === user?.email);
    });
  }, [projectId]);

  const myTheme = createTheme({
    theme: "dark",
    settings: {
      foreground: "#d4d4d4",
      gutterBackground: "#163042",
      fontFamily: "Cascadia-Code",
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

  const handleSaveClick = () => {
    if (project.id === "") {
      handleSave();
    } else {
      updateProject();
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "SignUp or LogIn first to save the project!",
        variant: "default",
      });
      return;
    }
    const id = Date.now().toString();
    const temp = await addDoc(collection(db, "Projects"), {
      ...project,
      id: id,
    })
      .then((res) => {
        toast({
          title: "Success",
          description: "Project Saved Successfully.",
          variant: "default",
        });
        setProject({ ...project, id });
      })
  };

  const updateProject = async () => {
    try {
      const q = firebaseQuery(
        collection(db, "Projects"),
        where("id", "==", project.id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (d) => {
        const projectRef = doc(db, "Projects", d.id);
        await updateDoc(projectRef, { ...project }).then((_) => {
          toast({
            title: "Success",
            description: "Project Saved Successfully.",
            variant: "default",
          });
        });
      });
    } catch (error) {
    }
  };

  useEffect(() => {
    const output = `
    <html>
    <head>
    </head>
    <style>
    ${project.css}
    </style>
    <body>
    ${project.html}
    <script>${project.js}</script>
    </body>
    </html>`;
    setOutputCode(output);
  }, [project]);

  return (
    <main className="min-h-screen h-screen">
      <Navbar>
        <div className="w-full h-full flex flex-row justify-between">
          <div className="flex flex-col">
            {sameOwner ? (
              <input
                type="text"
                className="p-0 m-0 bg-transparent border-0 outline-none text-base"
                value={project.title}
                onChange={(e) => {
                  setProject({ ...project, title: e.target.value });
                }}
              />
            ) : (
              <label className="p-0 m-0 bg-transparent border-0 outline-none text-base">
                {project.title}
              </label>
            )}
            <div className="text-sm">
              {project.owner.displayName || project.owner.email}
            </div>
          </div>
          <div className="flex flex-row gap-8">
            {sameOwner && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="private"
                    onCheckedChange={(e) => {
                      setProject({ ...project, private: e });
                    }}
                  />
                  <Label htmlFor="private">Private</Label>
                </div>
                <Button
                  onClick={() => handleSaveClick()}
                  className="flex flex-row gap-4"
                >
                  <FaSave />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </Navbar>
      <div className="w-full h-full pt-20">
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
                        setProject({ ...project, html: value });
                      }}
                      value={project.html}
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
                        setProject({ ...project, css: value });
                      }}
                      value={project.css}
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
                        setProject({ ...project, js: value });
                      }}
                      value={project.js}
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
              <CiCircleChevDown
                className={`text-3xl duration-200 ${
                  showOutput ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>
            <iframe srcDoc={outputCode} className="h-full w-full bg-white" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
