import { FileText, FileSpreadsheet, FileSignature, FileImage, File } from "lucide-react";
import { type ReactElement } from "react";

export const getFileIcon = (mimeType: string, fileName: string): ReactElement => {
  const lowerFileName = fileName.toLowerCase();

  // Image files
  if (mimeType.startsWith("image/") || 
      lowerFileName.endsWith(".jpg") || 
      lowerFileName.endsWith(".jpeg") || 
      lowerFileName.endsWith(".png") || 
      lowerFileName.endsWith(".gif") || 
      lowerFileName.endsWith(".webp") || 
      lowerFileName.endsWith(".svg")) {
    return <FileImage className="h-5 w-5 text-primary" />;
  }
  
  // PDF files
  if (mimeType === "application/pdf" || lowerFileName.endsWith(".pdf")) {
    return <FileText className="h-5 w-5 text-destructive" />;
  }
  
  // Word documents
  if (mimeType === "application/msword" || 
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerFileName.endsWith(".doc") || 
      lowerFileName.endsWith(".docx")) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  }
  
  // Excel spreadsheets
  if (mimeType === "application/vnd.ms-excel" || 
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      lowerFileName.endsWith(".xls") || 
      lowerFileName.endsWith(".xlsx")) {
    return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  }
  
  // PowerPoint presentations
  if (mimeType === "application/vnd.ms-powerpoint" || 
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      lowerFileName.endsWith(".ppt") || 
      lowerFileName.endsWith(".pptx")) {
    return <FileSignature className="h-5 w-5 text-orange-500" />;
  }
  
  // Text files
  if (mimeType === "text/plain" || lowerFileName.endsWith(".txt")) {
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
  
  // RTF files
  if (mimeType === "application/rtf" || lowerFileName.endsWith(".rtf")) {
    return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
  
  // Default file icon
  return <File className="h-5 w-5 text-muted-foreground" />;
};

// For use with File objects in upload contexts
export const getFileIconFromFile = (file: File): ReactElement => {
  return getFileIcon(file.type, file.name);
};