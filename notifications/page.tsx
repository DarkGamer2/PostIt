"use client";
import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      setNotifications((prev) => [event.data, ...prev]);
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h2>Live Notifications (SSE)</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
