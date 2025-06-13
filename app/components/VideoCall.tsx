"use client";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSocket } from "../hooks/useSocket";

const VideoCall = () => {
  const socket = useSocket();
  const myVideo = useRef<HTMLVideoElement>(null);
  const peerVideo = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    // Get the user's media
    const getUserMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing user media:", err);
      }
    };

    getUserMedia();

    if (!socket) return;

    const handleOffer = ({ from, offer }: { from: string; offer: any }) => {
      if (!stream) return; // Ensure stream is available

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.signal(offer);

      peer.on("stream", (remoteStream) => {
        if (peerVideo.current) {
          peerVideo.current.srcObject = remoteStream;
        }
      });

      peer.on("signal", (answer) => {
        socket.emit("answer", { to: from, answer });
      });

      peerRef.current = peer;
      setPeerId(from);
    };

    const handleAnswer = ({ answer }: { answer: any }) => {
      peerRef.current?.signal(answer);
    };

    const handleIceCandidate = ({ candidate }: { candidate: any }) => {
      peerRef.current?.signal(candidate);
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, [socket, stream]);

  const startCall = () => {
    if (!peerId || !stream || !socket) return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (offer) => {
      socket.emit("offer", { to: peerId, offer });
    });

    peer.on("stream", (remoteStream) => {
      if (peerVideo.current) {
        peerVideo.current.srcObject = remoteStream;
      }
    });

    peerRef.current = peer;
  };

  return (
    <div>
      <div>
        <h2>My Video</h2>
        <video ref={myVideo} autoPlay muted />
      </div>
      <div>
        <h2>Peer's Video</h2>
        <video ref={peerVideo} autoPlay />
      </div>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
