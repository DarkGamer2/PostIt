'use client';
import { useState } from 'react';

export default function SpamChecker() {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

  const checkSpam = async () => {
  const res = await fetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }) // 🟢 You were missing this
  });

  const data = await res.json();
  setResult(data.prediction);
};
    return (
         <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Spam Checker</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="border p-2 w-full mb-2 dark:bg-gray-800 dark:text-white"
        placeholder="Enter your post..."
      />
      <button
        onClick={checkSpam}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Check
      </button>
      {result && (
        <p className="mt-4">
          This post is classified as: <strong>{result}</strong>
        </p>
      )}
    </div>
    )
}