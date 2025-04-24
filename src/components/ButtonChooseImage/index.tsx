import React, { useEffect, useState } from "react";
import { Button, Grid, Box } from "@mui/material";
interface MultiImageUploadProps {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  defultImgs?: string;
}
const MultiImageUpload = (props: MultiImageUploadProps) => {
  const { setSelectedFiles, defultImgs } = props;
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const newPreviewUrls = fileArray.map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedFiles((prev) => [...prev, ...fileArray]);
    setPreviewUrls((prev) => [...newPreviewUrls, ...prev]);

    e.target.value = "";
  };
  useEffect(() => {
    if (defultImgs) {
      const newPreviewUrls = defultImgs.split(",");
      setPreviewUrls((prev) => [...newPreviewUrls]);
    }
   }, [defultImgs]);
  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        multiple
        id="upload-multiple-images"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <label htmlFor="upload-multiple-images">
        <Button variant="contained" component="span">
          Chọn nhiều ảnh
        </Button>
      </label>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          mt: 2,
          gap: 1,
          pb: 1,
        }}
      >
        {previewUrls.map((img, index) => (
          <Box
            key={index}
            sx={{
              minWidth: 100,
              maxWidth: 150,
              flexShrink: 0,
            }}
          >
            <img
              src={img}
              alt={`preview-${index}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MultiImageUpload;
