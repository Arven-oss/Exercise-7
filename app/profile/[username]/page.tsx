'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Recipe {
  id: number;
  title: string;
  protein: number;
  ingredients: string;
  instructions: string;
  image?: string;
  username: string; 
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username;
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const allRecipes: Recipe[] = JSON.parse(localStorage.getItem("all_recipes") || "[]");
      const userRecipes = allRecipes.filter(recipe => recipe.username === username);
      setRecipes(userRecipes);
    }
  }, [username]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Profile of {username}
        </h1>

        {/* Back to Home Button */}
        <button
          onClick={() => router.push("/home")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Home
        </button>

        {recipes.length === 0 ? (
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            {username} hasn't posted any recipes yet.
          </p>
        ) : (
          <ul className="flex flex-col items-center gap-6 mt-6">
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className="w-full md:w-3/4 p-4 border rounded-md dark:border-zinc-700 dark:bg-zinc-800 text-center"
              >
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-contain rounded-md mb-4"
                  />
                )}
                <h3 className="text-2xl font-semibold text-green-700 dark:text-green-400">
                  {recipe.title} ({recipe.protein}g protein)
                </h3>
                <p className="text-base text-zinc-700 dark:text-zinc-300 mt-2">
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>
                <p className="text-base text-zinc-700 dark:text-zinc-300 mt-2">
                  <strong>Instructions:</strong> {recipe.instructions}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}