import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload, Loader2 } from "lucide-react"; // ✅ Loader2 = spinner
import { uploadModelPhotos, fetchMyModelPhotos } from "@/services/modelPhotos";
import { getBaseUrl } from "@/services/utils/baseUrl";

interface PhotoUploaderProps {
  token: string;
  onUploadSuccess?: (hasPhoto: boolean) => void;
}

export default function PhotoUploader({ token, onUploadSuccess }: PhotoUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [isPro, setIsPro] = useState(false);

  // ✅ Get backend base URL
  useEffect(() => {
    getBaseUrl().then((url) => setBaseUrl(url));
  }, []);

  // ✅ Fetch Pro status
  useEffect(() => {
    if (!baseUrl || !token) return;
    
    const fetchProStatus = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/model/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const profile = await response.json();
          setIsPro(!!profile.is_pro);
        }
      } catch (error) {
        console.error("Failed to fetch Pro status:", error);
      }
    };
    
    fetchProStatus();
  }, [token, baseUrl]);

  // ✅ Fetch existing photos
  useEffect(() => {
    if (!baseUrl) return;
    fetchMyModelPhotos(token, (err, data) => {
      if (!err) {
        const photosWithFullUrl = (data?.groups?.Portfolio || []).map((p) => ({
          ...p,
          url: `${baseUrl}${p.url}`,
        }));
        setPhotos(photosWithFullUrl);
      }
    });
  }, [token, baseUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const maxPhotos = isPro ? 10 : 3;
    if (photos.length + newFiles.length > maxPhotos) {
      alert(`Max limit reached. You can only upload up to ${maxPhotos} photos.${!isPro ? ' Upgrade to Pro for up to 10 photos.' : ''}`);
      return;
    }
    setSelectedFiles(newFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    uploadModelPhotos(selectedFiles, token, (err, data) => {
      setLoading(false);

      if (err) {
        alert(err === "MAX_LIMIT" ? "Max limit reached." : "Upload failed.");
        return;
      }

      if (!baseUrl) return;
      const photosWithFullUrl = (data?.groups?.Portfolio || []).map((p) => ({
        ...p,
        url: `${baseUrl}${p.url}`,
      }));
      setPhotos(photosWithFullUrl);
      setSelectedFiles([]);
      if (photosWithFullUrl.length > 0) {
        onUploadSuccess?.(true);
      }
    });
  };

  useEffect(() => {
    if (photos.length > 0) {
      onUploadSuccess?.(true);
    }
  }, [photos, onUploadSuccess]);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <span className="font-semibold">Upload Photos (Max {isPro ? 10 : 3})</span>
            {isPro && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">PRO</span>}
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="photo-input"
            />
            <label htmlFor="photo-input">
              <Button variant="outline" asChild>
                <span>Select</span>
              </Button>
            </label>
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" /> Upload
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preview selected files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex gap-3 flex-wrap">
            {selectedFiles.map((file, i) => (
              <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Already uploaded photos */}
        {photos.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-2">Uploaded Photos:</p>
            <div className="flex gap-3 flex-wrap">
              {photos.map((p, i) => (
                <div key={i} className="w-24 h-24 rounded-lg overflow-hidden border">
                  <img
                    src={p.url}
                    alt={`uploaded-${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Optional: Full-screen overlay while uploading */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-slate-700" />
            <span className="ml-2 font-medium text-slate-700">Uploading...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
