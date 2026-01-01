import { forwardRef, useEffect, useId, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "@/styles/quill.css";
import { toast } from "sonner";
import { buildImageUrl } from "@/lib/utils";
import { useUploadBlogFile } from "@/features/admin/blogs/api/upload-blog-file";

interface BlogQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const QuillEditor = forwardRef<Quill | null, BlogQuillEditorProps>(
  ({ value, onChange, placeholder }, ref) => {
    const uniqueId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const quillInstanceRef = useRef<Quill | null>(null);
    const onChangeRef = useRef(onChange);
    const uploadBlogFileMutation = useUploadBlogFile();
    const uploadMutationRef = useRef(uploadBlogFileMutation);

    useLayoutEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
      uploadMutationRef.current = uploadBlogFileMutation;
    }, [uploadBlogFileMutation]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const parent = container.parentElement;
      const existingToolbar = parent?.querySelector(".ql-toolbar");
      if (existingToolbar) existingToolbar.remove();
      const existingContainer = parent?.querySelector(".ql-container");
      if (existingContainer && existingContainer !== container) {
        existingContainer.remove();
      }

      container.innerHTML = "";
      container.className = "";

      const editorContainer = document.createElement("div");
      container.appendChild(editorContainer);

      const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar");
            return;
          }

          if (file.size > 5 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 5MB");
            return;
          }

          const quill = quillInstanceRef.current;
          if (!quill) return;

          const range = quill.getSelection(true);
          if (!range) return;

          const loadingToast = toast.loading("Mengupload gambar...");

          try {
            const response = await uploadMutationRef.current.mutateAsync(file);
            quill.insertEmbed(
              range.index,
              "image",
              buildImageUrl(response.path)
            );
            quill.setSelection(range.index + 1, 0);
            toast.dismiss(loadingToast);
            toast.success("Gambar berhasil diupload");
          } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Gagal mengupload gambar");
            console.error("Upload error:", error);
          }
        };
      };

      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ align: [] }],
              ["link", "image"],
              ["blockquote", "code-block"],
              [{ color: [] }, { background: [] }],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        },
        placeholder:
          placeholder || "Tulis konten blog secara lengkap di sini...",
      });

      quillInstanceRef.current = quill;

      if (ref) {
        if (typeof ref === "function") {
          ref(quill);
        } else {
          ref.current = quill;
        }
      }

      const handleChange = () => {
        const html = quill.root.innerHTML;
        const normalized = html === "<p><br></p>" ? "" : html;
        onChangeRef.current?.(normalized);
      };

      quill.on("text-change", handleChange);

      return () => {
        quill.off("text-change", handleChange);
        quillInstanceRef.current = null;
        if (ref) {
          if (typeof ref === "function") {
            ref(null);
          } else {
            ref.current = null;
          }
        }
        const toolbar = parent?.querySelector(".ql-toolbar");
        if (toolbar) toolbar.remove();
        container.innerHTML = "";
        container.className = "";
      };
    }, [uniqueId, placeholder, ref]);

    useEffect(() => {
      const quill = quillInstanceRef.current;
      if (!quill) return;

      const currentContent = quill.root.innerHTML;
      const normalizedCurrent =
        currentContent === "<p><br></p>" ? "" : currentContent;
      const normalizedValue = value === "<p><br></p>" ? "" : value || "";

      if (normalizedValue !== normalizedCurrent) {
        const selection = quill.getSelection();
        quill.root.innerHTML = normalizedValue;
        if (selection) {
          quill.setSelection(selection);
        }
      }
    }, [value]);

    return (
      <div className="quill-wrapper" data-quill-id={uniqueId}>
        <div ref={containerRef} />
      </div>
    );
  }
);

QuillEditor.displayName = "BlogQuillEditor";
