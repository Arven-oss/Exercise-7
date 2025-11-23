'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", data.username);
      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: "url('/1.jpg')" }}>
      <main className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-md backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-center text-zinc-900 dark:text-zinc-50">Login</h1>
        <input type="text" placeholder="Username"
               className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:text-white"
               value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password"
               className="w-full p-3 border rounded-md dark:bg-zinc-800 dark:text-white"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}
                className="w-full p-3 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Login
        </button>
        <p className="text-sm text-center text-zinc-700 dark:text-zinc-300 mt-2">
          Don’t have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </main>
    </div>
  );
}