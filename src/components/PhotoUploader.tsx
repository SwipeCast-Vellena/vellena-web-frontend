import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Upload } from "lucide-react";
import { uploadModelPhotos, fetchMyModelPhotos } from "@/services/modelPhotos";
import { getBaseUrl } from "@/services/utils/baseUrl";

export default function PhotoUploader({ token }: { token: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>("");

  // ✅ Get backend base URL
  useEffect(() => {
    getBaseUrl().then((url) => setBaseUrl(url));
  }, []);

  // ✅ Fetch existing photos
  useEffect(() => {
    if (!baseUrl) return; // wait until baseUrl is set
    fetchMyModelPhotos(token, (err, data) => {
      if (!err) {
        const photosWithFullUrl = (data?.groups?.Portfolio || []).map((p) => ({
          ...p,
          url: `${baseUrl}${p.url}`,
        }));
        console.log("Fetched photos:", photosWithFullUrl); // <-- log here
        setPhotos(photosWithFullUrl);
      }
    });
  }, [token, baseUrl]);

  // ✅ Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    // Check max 3 limit
    if (photos.length + newFiles.length > 3) {
      alert("Max limit reached. You can only upload up to 3 photos.");
      return;
    }

    setSelectedFiles(newFiles);
  };

  // ✅ Upload selected files
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);

    uploadModelPhotos(selectedFiles, token, (err, data) => {
      setLoading(false);

      if (err) {
        if (err === "MAX_LIMIT") {
          alert("Max limit reached. Remove a photo before uploading new ones.");
        } else {
          alert("Upload failed. Please try again.");
        }
        return;
      }

      if (!baseUrl) return;
      const photosWithFullUrl = (data?.groups?.Portfolio || []).map((p) => ({
        ...p,
        url: `${baseUrl}${p.url}`,
      }));
      setPhotos(photosWithFullUrl);
      setSelectedFiles([]);
    });
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <span className="font-semibold">Upload Photos (Max 3)</span>
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
              <Upload className="w-4 h-4 mr-1" />
              {loading ? "Uploading..." : "Upload"}
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
      </CardContent>
    </Card>
  );
}
