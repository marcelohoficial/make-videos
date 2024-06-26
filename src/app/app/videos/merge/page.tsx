import { exec } from "child_process";
import ffmpegPath from "ffmpeg-static";
import formidable from "formidable";
import { useState } from "react";

export default function Home() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [outputVideo, setOutputVideo] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = new formidable.IncomingForm();
    form.parse(event.target, (err, fields, files) => {
      if (err) throw err;
      const fileKeys = Object.keys(files);
      setVideoFiles(fileKeys.map((key) => files[key]));
    });
  };

  const handleMergeVideos = async () => {
    const fileNames = videoFiles.map((file) => file.path).join("|");
    const outputFilePath = "./public/output.mp4";
    const command = `${ffmpegPath} -i "concat:${fileNames}" -c copy ${outputFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      setOutputVideo(outputFilePath);
    });
  };

  return (
    <div>
      <h1>Merge Multiple Videos</h1>
      <form onSubmit={handleFormSubmit} encType="multipart/form-data">
        <input type="file" name="videos" multiple />
        <button type="submit">Submit</button>
      </form>
      <button onClick={handleMergeVideos} disabled={videoFiles.length === 0}>
        Merge Videos
      </button>
      {outputVideo && (
        <video controls>
          <source src={outputVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
