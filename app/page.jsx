"use client"
import { useState, useEffect } from 'react';
import './globals.css';

export default function Home() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [videoList, setVideoList] = useState([]);




  // Handle file upload
  const handleUpload = async () => {
    if (!file || !title) return alert("Please select a file and enter a title");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setVideoURL(data.data.secure_url);
      alert("Upload Successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  // Fetch all uploaded videos
  // Fetch videos on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`);
        const data = await response.json();
        // Check if `data.videos` exists and is an array
        setVideoList(data || []); // Default to an empty array if no videos
        console.log(data)
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
    fetchVideos();
  }, []);


  return (
    <div>
      <h1>Upload and Stream Videos</h1>
      <div style={{ display: "flex", flexDirection: "column", width: "90vw" }}>
        <label>
          File Title : &nbsp;
          <input
            type="text"
            placeholder="Write Title Here"
            onChange={(e) => setTitle(e.target.value)}
            style={{ color: "gray" }}
          />
          <p>(avoid &#47;, &#63;, &#58; in file name and don&apos;t use whitespace in the end)</p>
        </label>
        <br />
        <label>
          Choose Your File: &nbsp;
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0])} />
        </label>
        <br />
        <button onClick={handleUpload} disabled={uploading} style={{ border: "1px solid gray" }}>
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

        {videoURL && (
          <div>
            <h2>Uploaded Video</h2>
            <video width="320" height="240" controls>
              <source src={videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      <h2>Uploaded Videos:</h2>
      {videoList.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul style={{ paddingLeft: '0px' }}>
          {videoList.map((video, index) => (
            <li key={index} style={{ listStyle: "none" }}>
              <h3 style={{ paddingBottom: "-2px", marginBottom: "-2px" }}>{video.title}</h3>
              <video controls width="500" src={video.url}></video>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
