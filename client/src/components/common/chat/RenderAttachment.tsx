import { Paperclip } from "lucide-react";

const RenderAttachment = (url: string, isMe: boolean) => {
  const lowercaseUrl = url.toLowerCase();
  const isImage = lowercaseUrl.match(/\.(jpeg|jpg|gif|png|webp)/) !== null;
  const isVideo = lowercaseUrl.match(/\.(mp4|webm|ogg|mov)/) !== null;

  if (isImage) {
    return (
      <div className="mt-2 max-w-sm rounded-lg overflow-hidden border border-border/30 shadow-sm bg-black/5">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt="Attachment" className="max-h-60 w-auto object-contain hover:opacity-95 transition-opacity" />
        </a>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="mt-2 max-w-sm rounded-lg overflow-hidden border border-border/30 bg-black">
        <video src={url} controls className="max-h-60 w-full object-contain" />
      </div>
    );
  }

  const fileName = decodeURIComponent(url.split('/').pop() || "Download File");
  const cleanFileName = fileName.includes("-") ? fileName.substring(fileName.indexOf("-") + 1) : fileName;

  return (
    <div className={`mt-2 flex items-center gap-2 p-2 rounded-lg transition-colors border text-xs ${
      isMe 
        ? "bg-white/10 hover:bg-white/20 border-white/10 text-white" 
        : "bg-black/5 hover:bg-black/10 border-black/10 text-card-foreground"
    }`}>
      <Paperclip className="h-4 w-4 shrink-0" />
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline font-medium truncate max-w-[200px]">
        {cleanFileName}
      </a>
    </div>
  );
};

export default RenderAttachment;