"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Input,
  TextArea,
  Select,
  ListBox,
  Label,
  Drawer,
  Spinner,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import type { Key } from "@heroui/react";
import TailwindEditor from "@/components/editor";
import { useCreateArticleMutation } from "@/lib/store/api/articlesApi";
import { useAppSelector } from "@/lib/store/hooks";
import { ImageIcon, X, UploadSimple, UploadIcon } from "@phosphor-icons/react";

const CATEGORIES = [
  { label: "AI", value: "AI" },
  { label: "Developer Tools", value: "DEVELOPER_TOOLS" },
  { label: "Cloud", value: "CLOUD" },
  { label: "Productivity", value: "PRODUCTIVITY" },
  { label: "DevOps & Infrastructure", value: "DEVOPS_INFRASTRUCTURE" },
];

export default function CreatePostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Key | null>(null);
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState("");
  const [platformUrl, setPlatformUrl] = useState("");
  const [content, setContent] = useState("");
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const handleTitleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const editorEl = document.querySelector(".ProseMirror") as HTMLElement;
      editorEl?.focus();
    }
  };

  // Cover image handling
  const handleCoverFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast({
        title: "Invalid file",
        description: "Please upload an image file.",
        color: "danger",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast({
        title: "File too large",
        description: "Cover image must be under 10MB.",
        color: "danger",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCoverDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingCover(false);
      const file = e.dataTransfer.files[0];
      if (file) handleCoverFile(file);
    },
    [handleCoverFile],
  );

  const handleCoverDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(true);
  }, []);

  const handleCoverDragLeave = useCallback(() => {
    setIsDraggingCover(false);
  }, []);

  const handlePublish = async () => {
    if (!title) {
      addToast({
        title: "Missing title",
        description: "Please add a title to your post.",
        color: "danger",
      });
      return;
    }
    if (!content) {
      addToast({
        title: "Missing content",
        description: "Please write some content.",
        color: "danger",
      });
      return;
    }
    if (!description) {
      addToast({
        title: "Missing description",
        description: "Please add a short description.",
        color: "danger",
      });
      return;
    }
    if (!category) {
      addToast({
        title: "Missing category",
        description: "Please select a category.",
        color: "danger",
      });
      return;
    }

    try {
      const payload = {
        title,
        description,
        category: category as string,
        subCategory: subCategory || undefined,
        image: image || undefined,
        platformUrl: platformUrl || undefined,
        content,
      };

      const result = await createArticle(payload).unwrap();

      addToast({
        title: "Published!",
        description: "Your post is now live.",
        color: "success",
      });

      router.push(`/article/${result.slug}`);
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Failed to publish. Please try again.",
        color: "danger",
      });
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[740px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Draft</span>
            {content && (
              <span className="text-xs text-muted/60">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="primary"
              onPress={() => {
                if (!title || !content) {
                  addToast({
                    title: "Not ready",
                    description:
                      "Please add a title and some content before publishing.",
                    color: "warning",
                  });
                  return;
                }
                setIsPublishOpen(true);
              }}
            >
              <UploadIcon /> Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Editor area */}
      <main className="mx-auto max-w-[740px] px-6 py-10">
        {/* Cover image */}
        {image ? (
          <div className="relative mb-8 group">
            <img
              src={image}
              alt="Cover"
              className="w-full max-h-[400px] object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  className="bg-white/90 text-black rounded-full p-2 hover:bg-white transition-colors"
                  onClick={() => coverInputRef.current?.click()}
                  title="Change cover"
                >
                  <UploadSimple size={20} />
                </button>
                <button
                  className="bg-red-500/90 text-white rounded-full p-2 hover:bg-red-500 transition-colors"
                  onClick={() => setImage("")}
                  title="Remove cover"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className={`w-full mb-6 py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm transition-colors cursor-pointer ${
              isDraggingCover
                ? "border-accent bg-accent/5 text-accent"
                : "border-muted/30 text-muted/60 hover:border-muted/50 hover:text-muted"
            }`}
            onClick={() => coverInputRef.current?.click()}
            onDrop={handleCoverDrop}
            onDragOver={handleCoverDragOver}
            onDragLeave={handleCoverDragLeave}
          >
            <ImageIcon size={20} />
            Add a cover image
          </button>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverFile(file);
            e.target.value = "";
          }}
        />

        {/* Title */}
        <textarea
          ref={titleRef}
          className="w-full resize-none overflow-hidden border-none bg-transparent text-[42px] font-bold leading-tight text-foreground placeholder:text-muted/40 focus:outline-none"
          placeholder="Title"
          rows={1}
          value={title}
          onChange={handleTitleInput}
          onKeyDown={handleTitleKeyDown}
        />

        {/* Editor */}
        <div className="mt-4">
          <TailwindEditor onChange={setContent} />
        </div>
      </main>

      {/* Publish drawer */}
      <Drawer isOpen={isPublishOpen} onOpenChange={setIsPublishOpen}>
        <Drawer.Backdrop>
          <Drawer.Content placement="right">
            <Drawer.Dialog className="max-w-md">
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Publish your post</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <div className="flex flex-col gap-5">
                  <p className="text-sm text-muted">
                    Add some details before publishing to help readers discover
                    your post.
                  </p>

                  {/* Cover image preview in drawer */}
                  <div>
                    <Label className="text-sm mb-2 block">Cover Image</Label>
                    {image ? (
                      <div className="relative group rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt="Cover preview"
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 text-white rounded-full p-1.5 hover:bg-red-500"
                            onClick={() => setImage("")}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full py-8 border-2 border-dashed border-muted/30 rounded-lg flex flex-col items-center gap-1 text-sm text-muted/60 hover:border-muted/50 hover:text-muted cursor-pointer transition-colors"
                        onClick={() => coverInputRef.current?.click()}
                      >
                        <UploadSimple size={24} />
                        Upload cover image
                      </button>
                    )}
                  </div>

                  <TextField
                    className="w-full"
                    value={description}
                    onChange={setDescription}
                  >
                    <Label>Description *</Label>
                    <TextArea
                      placeholder="A brief summary of your post..."
                      variant="secondary"
                    />
                  </TextField>

                  <Select
                    className="w-full"
                    placeholder="Select a category"
                    value={category}
                    onChange={(val) => setCategory(val)}
                  >
                    <Label>Category *</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {CATEGORIES.map((cat) => (
                          <ListBox.Item
                            key={cat.value}
                            id={cat.value}
                            textValue={cat.label}
                          >
                            {cat.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField
                    className="w-full"
                    value={subCategory}
                    onChange={setSubCategory}
                  >
                    <Label>Sub Category</Label>
                    <Input
                      placeholder="e.g. React, Next.js"
                      variant="secondary"
                    />
                  </TextField>

                  <TextField
                    className="w-full"
                    value={platformUrl}
                    onChange={setPlatformUrl}
                  >
                    <Label>Original Platform URL</Label>
                    <Input
                      placeholder="https://medium.com/..."
                      variant="secondary"
                    />
                  </TextField>
                </div>
              </Drawer.Body>
              <Drawer.Footer>
                <Button slot="close" variant="secondary">
                  Cancel
                </Button>
                <Button isPending={isLoading} onPress={handlePublish}>
                  {({ isPending }) => (
                    <>
                      {isPending ? (
                        <Spinner className="text-current" size="sm" />
                      ) : null}
                      Publish Now
                    </>
                  )}
                </Button>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
