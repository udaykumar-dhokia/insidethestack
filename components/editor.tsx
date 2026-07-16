"use client";

import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  UpdatedImage,
  UploadImagesPlugin,
  createImageUpload,
  handleImagePaste,
  handleImageDrop,
  useEditor,
} from "novel";
import { useState } from "react";
import { Modal, TextField, Label, Input, Button } from "@heroui/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "novel";
import { Markdown } from "tiptap-markdown";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  TextB,
  TextItalic,
  TextUnderline as TextUnderlineIcon,
  TextStrikethrough,
  Code,
  LinkSimple,
  Quotes,
  ListBullets,
  ListNumbers,
  TextHOne,
  TextHTwo,
  TextHThree,
  CodeBlock,
} from "@phosphor-icons/react";

const lowlight = createLowlight(common);

// Image upload handler — converts to base64 data URL (no backend needed)
const uploadFn = createImageUpload({
  onUpload: async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },
  validateFn: (file: File) => {
    if (!file.type.includes("image/")) {
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      return false;
    }
    return true;
  },
});

const extensions = [
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
    codeBlock: false,
  }),
  Placeholder.configure({
    placeholder: "Tell your story...",
    includeChildren: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  Underline,
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-accent underline underline-offset-2 cursor-pointer",
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: "rounded-lg max-w-full mx-auto",
    },
  }),
  UploadImagesPlugin({
    imageClass: "opacity-40 rounded-lg border border-muted",
  }),
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      class: "rounded-lg bg-muted/10 p-4 font-mono text-sm",
    },
  }),
];

interface TailwindEditorProps {
  initialValue?: any;
  onChange: (value: string) => void;
}

function BubbleButton({
  isActive,
  onClick,
  children,
  title,
}: {
  isActive?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      className={`p-1.5 rounded transition-colors ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
      title={title}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss from editor
        onClick();
      }}
    >
      {children}
    </button>
  );
}

function BubbleSeparator() {
  return <div className="w-px h-5 bg-white/20 mx-0.5" />;
}

function EditorMenu() {
  const { editor } = useEditor();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  
  if (!editor) return null;
  
  return (
    <>
      <EditorBubble
        tippyOptions={{
          placement: "top",
          zIndex: 50,
          animation: "shift-toward-subtle",
          moveTransition: "transform 0.15s ease-out",
        }}
        className="flex flex-wrap max-w-[85vw] md:max-w-[500px] items-center gap-0.5 rounded-lg bg-[#1e1e1e] shadow-2xl border border-white/10 px-1.5 py-1 z-50"
      >
        <BubbleButton
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <TextHOne size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <TextHTwo size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <TextHThree size={18} weight="bold" />
        </BubbleButton>

        <BubbleSeparator />

        <BubbleButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <TextB size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <TextItalic size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <TextUnderlineIcon size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <TextStrikethrough size={18} weight="bold" />
        </BubbleButton>

        <BubbleSeparator />

        <BubbleButton
          isActive={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Inline Code"
        >
          <Code size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <CodeBlock size={18} weight="bold" />
        </BubbleButton>

        <BubbleSeparator />

        <BubbleButton
          isActive={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setIsLinkModalOpen(true);
            }
          }}
          title="Link"
        >
          <LinkSimple size={18} weight="bold" />
        </BubbleButton>

        <BubbleSeparator />

        <BubbleButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <Quotes size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <ListBullets size={18} weight="bold" />
        </BubbleButton>

        <BubbleButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListNumbers size={18} weight="bold" />
        </BubbleButton>
      </EditorBubble>

      {/* Link Modal */}
      <Modal.Backdrop isOpen={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
        <Modal.Container>
          <Modal.Dialog className="max-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Add Link</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <TextField
                autoFocus
                className="w-full"
                value={linkUrl}
                onChange={setLinkUrl}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && linkUrl) {
                    e.preventDefault();
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                    setIsLinkModalOpen(false);
                    setLinkUrl("");
                  }
                }}
              >
                <Label>URL</Label>
                <Input placeholder="https://example.com" />
              </TextField>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary" onPress={() => setLinkUrl("")}>
                Cancel
              </Button>
              <Button 
                onPress={() => {
                  if (linkUrl) {
                    editor.chain().focus().setLink({ href: linkUrl }).run();
                    setIsLinkModalOpen(false);
                    setLinkUrl("");
                  }
                }}
              >
                Add Link
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

export default function TailwindEditor({ initialValue, onChange }: TailwindEditorProps) {
  return (
    <EditorRoot>
      <EditorContent
        className="prose dark:prose-invert max-w-none w-full min-h-[60vh] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[60vh] prose-p:m-0 prose-p:mb-2"
        extensions={extensions as any}
        initialContent={initialValue}
        immediatelyRender={false}
        editorProps={{
          handlePaste: (view, event) =>
            handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: "focus:outline-none",
          },
        }}
        onUpdate={({ editor }) => {
          const markdown =
            (editor.storage.markdown as any)?.getMarkdown?.() ??
            editor.getHTML();
          onChange(markdown);
        }}
      >
        {/* Floating toolbar on text selection */}
        <EditorMenu />
      </EditorContent>
    </EditorRoot>
  );
}
