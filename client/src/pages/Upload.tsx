import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, X, FileImage, Check, AlertTriangle, Info } from "lucide-react";
import { uploadEmojiSchema } from "@shared/schema";
import { z } from "zod";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    tags: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.responseText || 'Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(data);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Emoji uploaded successfully",
        variant: "success",
      });
      
      // Reset form
      setFile(null);
      setFormData({ name: "", category: "", tags: "" });
      setUploadProgress(0);
      
      // Invalidate stats to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/png', 'image/gif', 'image/apng'];
    if (!allowedTypes.includes(file.type)) {
      return "Invalid file type. Only PNG, GIF, and APNG files are allowed.";
    }

    // Check file size (256KB)
    if (file.size > 256 * 1024) {
      return "File size must be 256KB or smaller.";
    }

    return null;
  };

  const validateImageDimensions = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width > 250 || img.height > 250) {
          resolve("Image dimensions must be 250×250 pixels or smaller.");
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve("Failed to read image dimensions.");
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (selectedFile: File) => {
    const fileError = validateFile(selectedFile);
    if (fileError) {
      toast({
        title: "Invalid file",
        description: fileError,
        variant: "destructive",
      });
      return;
    }

    const dimensionError = await validateImageDimensions(selectedFile);
    if (dimensionError) {
      toast({
        title: "Invalid dimensions",
        description: dimensionError,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Auto-populate name from filename
    if (!formData.name) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFormData(prev => ({ ...prev, name: nameWithoutExt }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose a file first.",
        variant: "destructive",
      });
      return;
    }

    // Validate form data
    try {
      uploadEmojiSchema.parse({
        name: formData.name,
        category: formData.category || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid form data",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name);
    if (formData.category) data.append('category', formData.category);
    if (formData.tags) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      tags.forEach(tag => data.append('tags', tag));
    }

    uploadMutation.mutate(data);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-discord-gradient">
          Upload Emoji
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your creativity with the community. Upload PNG, GIF, or APNG files up to 256KB and 250×250 pixels.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-surface border-border p-8 mb-8">
          {/* Drag and Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/30 hover:border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-6xl text-muted-foreground group-hover:text-primary mb-4 transition-colors duration-300">
              <CloudUpload className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              Drop your emoji here
            </h3>
            <p className="text-muted-foreground mb-6">
              or click to browse files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".png,.gif,.apng,image/png,image/gif"
              onChange={handleFileInputChange}
            />
            <Button type="button" className="discord-gradient text-white">
              Choose File
            </Button>
          </div>

          {/* File Preview */}
          {file && (
            <Card className="mt-8 p-6 bg-background/50 border-border">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{file.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • Awaiting upload
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
              <Label htmlFor="name" className="text-muted-foreground">
                Emoji Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="my_awesome_emoji"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-muted-foreground">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="animated">Animated</SelectItem>
                  <SelectItem value="static">Static</SelectItem>
                  <SelectItem value="reaction">Reaction</SelectItem>
                  <SelectItem value="meme">Meme</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="tags" className="text-muted-foreground">
              Tags (optional)
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="funny, reaction, gaming"
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>

          {/* Upload Button */}
          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              disabled={!file || !formData.name || uploadMutation.isPending}
              className="discord-gradient text-white px-8 py-4 text-lg font-semibold hover:scale-105 disabled:hover:scale-100 transition-transform duration-300"
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudUpload className="mr-2 h-5 w-5" />
                  Upload Emoji
                </>
              )}
            </Button>
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="mt-6">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </Card>
      </form>

      {/* Upload Guidelines */}
      <Card className="bg-surface/50 border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          <Info className="inline mr-2 h-5 w-5" />
          Upload Guidelines
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Supported formats: PNG, GIF, APNG</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Maximum file size: 256 KB</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Maximum dimensions: 250×250 pixels</span>
          </li>
          <li className="flex items-start space-x-2">
            <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <span>No explicit, hateful, or copyrighted content</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
