import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Spinner } from 'phosphor-react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

interface ImageUploadProps {
  value: string;
  onChange: (url: string, storageId?: string) => void;
  aspectRatio?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  aspectRatio = 'aspect-video',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Step 1: Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) throw new Error('Upload failed');

      const { storageId } = await result.json();

      // Step 3: Return the storage ID — the consuming component saves it to the post
      // For preview, construct a temporary URL
      onChange(URL.createObjectURL(file), storageId);
    } catch {
      setError('Failed to upload image. Try pasting a URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  if (value) {
    return (
      <div className={`relative ${aspectRatio} rounded-lg overflow-hidden bg-muted group`}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-full object-cover"
          onError={() => setError('Failed to load image')}
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            title="Replace image"
          >
            <Upload weight="bold" className="h-5 w-5 text-white" />
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
            title="Remove image"
          >
            <X weight="bold" className="h-5 w-5 text-white" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          ${aspectRatio} rounded-lg border-2 border-dashed cursor-pointer
          flex flex-col items-center justify-center gap-3 transition-colors
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {isUploading ? (
          <>
            <Spinner weight="bold" className="h-8 w-8 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-muted">
              <ImageIcon weight="duotone" className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Drop image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>

      {/* URL input toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Or paste image URL
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
