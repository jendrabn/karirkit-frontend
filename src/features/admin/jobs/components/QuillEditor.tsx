import { useEffect, useRef, useId } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "@/styles/quill.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function QuillEditor({
  value,
  onChange,
  placeholder,
}: QuillEditorProps) {
  const uniqueId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any existing Quill elements first
    const existingToolbar =
      container.parentElement?.querySelector(".ql-toolbar");
    if (existingToolbar) {
      existingToolbar.remove();
    }
    const existingContainer =
      container.parentElement?.querySelector(".ql-container");
    if (existingContainer && existingContainer !== container) {
      existingContainer.remove();
    }

    // Reset container
    container.innerHTML = "";
    container.className = "";

    const quill = new Quill(container, {
      theme: "snow",
      placeholder: placeholder || "Tulis sesuatu...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link"],
          ["clean"],
        ],
      },
    });

    quillInstanceRef.current = quill;

    const handleChange = () => {
      const html = quill.root.innerHTML;
      onChange(html === "<p><br></p>" ? "" : html);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
      quillInstanceRef.current = null;

      // Aggressive cleanup
      const wrapper = container.parentElement;
      if (wrapper) {
        const toolbar = wrapper.querySelector(".ql-toolbar");
        if (toolbar) toolbar.remove();
      }
      container.innerHTML = "";
      container.className = "";
    };
  }, [uniqueId, placeholder, onChange]);

  // Sync external value changes
  useEffect(() => {
    const quill = quillInstanceRef.current;
    if (!quill) return;

    const currentContent = quill.root.innerHTML;
    const normalizedCurrent =
      currentContent === "<p><br></p>" ? "" : currentContent;

    if (value !== normalizedCurrent) {
      const selection = quill.getSelection();
      quill.root.innerHTML = value || "";
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
