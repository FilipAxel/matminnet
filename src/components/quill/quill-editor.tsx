import dynamic from "next/dynamic";
const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  quillContent: string; // Add this prop
  setQuillContent: React.Dispatch<React.SetStateAction<string>>; // Add this prop
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  quillContent,
  setQuillContent,
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  return (
    <div className="max-h-[350px]">
      <DynamicReactQuill
        className="mb-4 h-[100px]"
        theme="snow"
        value={quillContent}
        onChange={(value) => setQuillContent(value)}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default QuillEditor;
