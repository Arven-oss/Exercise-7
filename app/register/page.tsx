'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const user = { username, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration successful! You can now log in.");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/1.jpg')" }}>
     <main className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-md backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-center text-zinc-900 dark:text-zinc-50">
          Register
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border border-zinc-300 rounded-md dark:bg-zinc-800 dark:text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-zinc-300 rounded-md dark:bg-zinc-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full p-3 mt-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
        >
          Register
        </button>
        <p className="text-sm text-center text-zinc-700 dark:text-zinc-300 mt-2">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </main>
    </div>
  );
}