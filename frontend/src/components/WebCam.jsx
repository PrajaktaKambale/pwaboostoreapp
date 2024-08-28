// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";

// const videoConstraints = {
//   width: 540,
//   facingMode: "environment",
// };
// const Camera = () => {
//   const webcamRef = useRef(null);

//   const [url, setUrl] = useState(null);

//   const capturePhoto = React.useCallback(async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setUrl(imageSrc);
//   }, [webcamRef]);

//   const onUserMedia = (e) => {
//     console.log("e", e);
//   };
//   return (
//     <>
//       <Webcam
//         ref={webcamRef}
//         audio={true}
//         screenshotFormat="image/png"
//         videoConstraints={videoConstraints}
//         onUserMedia={onUserMedia}
//         mirrored={true}
//         screenshotQuality={1}
//       />
//       <button onClick={capturePhoto}>Capture</button>
//       <button onClick={() => setUrl(null)}>Refresh</button>
//       {url && (
//         <div>
//           <img src={url} alt="Screenshot" />
//         </div>
//       )}
//     </>
//   );
// };

// export default Camera;

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 540,
  facingMode: "environment",
};

const Camera = () => {
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);

  const capturePhoto = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUrl(imageSrc);
  }, [webcamRef]);

  const onUserMedia = (stream) => {
    console.log("User media stream:", stream);
  };

  const onUserMediaError = (error) => {
    console.error("Error accessing webcam:", error);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
        onUserMediaError={onUserMediaError}
        mirrored={true}
      />
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={() => setUrl(null)}>Refresh</button>
      {url && (
        <div>
          <img src={url} alt="Screenshot" />
        </div>
      )}
    </>
  );
};

export default Camera;
