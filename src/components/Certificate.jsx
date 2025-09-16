import React, { useState } from "react";
import { Modal, IconButton, Box, Backdrop, Typography, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Certificate = ({ ImgSertif, Platform }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const originalURL = (ImgSertif || "").trim();
  const isDrive = originalURL.includes("drive.google.com");

  // Extract Drive fileId from /d/<id>/... or ?id=<id>
  let fileId = null;
  if (isDrive) {
    let m = originalURL.match(/\/d\/([^/]+)/);
    if (!m) m = originalURL.match(/[?&]id=([^&]+)/);
    fileId = m && m[1] ? m[1] : null;
  }

  // One URL for Drive previews (works for images & PDFs)
  const drivePreviewURL = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;

  // Lightweight PDF detection ONLY for non-Drive URLs (Drive preview handles both)
  const isPDF =
    !isDrive &&
    (originalURL.toLowerCase().endsWith(".pdf") || originalURL.toLowerCase().includes("format=pdf"));

  const handleImageError = () => {
    setError("Failed to load image or file. Please check the URL.");
  };

  const handleLoadingStart = () => {
    setLoading(true);
    setError(null); // Reset any previous errors
  };

  const handleLoadingEnd = () => {
    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Thumbnail (grid card) */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          cursor: "pointer",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={() => setOpen(true)}
      >
        {/* Show preview based on file type */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}

        {error ? (
          <Box
            sx={{
              width: "100%",
              height: 200,
              bgcolor: "#222",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1">{error}</Typography>
          </Box>
        ) : isDrive && drivePreviewURL ? (
          // For Google Drive files, use the preview iframe
          <iframe
            src={drivePreviewURL}
            style={{ border: "none", width: "100%", height: 200 }}
            title="Certificate Preview"
            loading="lazy"
            onLoad={handleLoadingEnd}
            onError={handleImageError}
          />
        ) : isPDF ? (
          // Non-Drive PDF
          <Box
            sx={{
              width: "100%",
              height: 200,
              bgcolor: "#222",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1">View PDF</Typography>
          </Box>
        ) : (
          // Regular image
          <img
            src={originalURL}
            alt={Platform ? `${Platform} Certificate` : "Certificate"}
            style={{ width: "100%", height: "auto", display: "block" }}
            onLoad={handleLoadingEnd}
            onError={handleImageError}
          />
        )}

        {Platform && (
          <Box
            sx={{
              position: "absolute",
              left: 8,
              bottom: 8,
              px: 1.25,
              py: 0.5,
              fontSize: 12,
              borderRadius: 1,
              bgcolor: "rgba(0,0,0,0.55)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {Platform}
          </Box>
        )}
      </Box>

      {/* Modal (full view) */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: { backgroundColor: "rgba(0,0,0,0.9)" },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ position: "relative", width: "90vw", height: "90vh" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "white",
              zIndex: 2,
            }}
          >
            <CloseIcon />
          </IconButton>

          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          )}

          {error ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "#222",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body1">{error}</Typography>
            </Box>
          ) : isDrive && drivePreviewURL ? (
            <iframe
              src={drivePreviewURL}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Certificate"
              onLoad={handleLoadingEnd}
              onError={handleImageError}
            />
          ) : isPDF ? (
            <iframe
              src={originalURL}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Certificate PDF"
              onLoad={handleLoadingEnd}
              onError={handleImageError}
            />
          ) : (
            <img
              src={originalURL}
              alt={Platform ? `${Platform} Certificate` : "Certificate"}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                margin: "0 auto",
              }}
              onLoad={handleLoadingEnd}
              onError={handleImageError}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;
