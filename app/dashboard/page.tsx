'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Recipe {
  id: number;
  title: string;
  protein: number;
  ingredients: string;
  instructions: string;
  image?: string;
  username: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    protein: "",
    ingredients: "",
    instructions: "",
    image: "",
  });

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("loggedIn");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (loggedIn !== "true" || !storedUser) {
      router.push("/");
      return;
    }

    setUser(storedUser);

    const userRecipesKey = `recipes_${storedUser.username}`;
    let storedRecipes: Recipe[] = [];
    try {
      storedRecipes = JSON.parse(localStorage.getItem(userRecipesKey) || "[]");
    } catch {
      storedRecipes = [];
    }
    setRecipes(storedRecipes);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("loggedIn");
    }
    router.push("/");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.username || typeof window === "undefined") return;
    if (!newRecipe.title || !newRecipe.protein) return;

    const recipe: Recipe = {
      id: Date.now(),
      title: newRecipe.title,
      protein: Number(newRecipe.protein),
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
      image: newRecipe.image || "",
      username: user.username,
    };

    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);

    try {
      localStorage.setItem(`recipes_${user.username}`, JSON.stringify(updatedRecipes));

      const allRecipes = JSON.parse(localStorage.getItem("all_recipes") || "[]");
      allRecipes.push(recipe);
      localStorage.setItem("all_recipes", JSON.stringify(allRecipes));
    } catch (err) {
      console.error("Failed to save recipes to localStorage", err);
    }

    setNewRecipe({ title: "", protein: "", ingredients: "", instructions: "", image: "" });
  };

  const handleDeleteRecipe = (id: number) => {
    if (!user) return;

    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updatedRecipes);

    // Update user's recipes in localStorage
    localStorage.setItem(`recipes_${user.username}`, JSON.stringify(updatedRecipes));

    // Update all recipes
    const allRecipes = JSON.parse(localStorage.getItem("all_recipes") || "[]");
    const updatedAllRecipes = allRecipes.filter((recipe: Recipe) => recipe.id !== id);
    localStorage.setItem("all_recipes", JSON.stringify(updatedAllRecipes));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col gap-6 w-full max-w-2xl p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          🥩 Hi {user?.username}, welcome to your Protein Recipe Dashboard!
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300">
          Share your favorite high-protein recipes and explore others!
        </p>

        {/* Recipe Form */}
        <form onSubmit={handleAddRecipe} className="space-y-3 text-left">
          <input
            type="text"
            placeholder="Recipe Title"
            value={newRecipe.title}
            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
          />
          <input
            type="number"
            min="0"
            placeholder="Protein (g per serving)"
            value={newRecipe.protein}
            onChange={(e) => setNewRecipe({ ...newRecipe, protein: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
          />
          <textarea
            placeholder="Ingredients (comma-separated)"
            value={newRecipe.ingredients}
            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
          />
          <textarea
            placeholder="Instructions"
            value={newRecipe.instructions}
            onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
            className="w-full p-2 border rounded-md dark:bg-zinc-800"
          />

          <div className="w-full p-2 border rounded-md dark:bg-zinc-800">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-zinc-700 dark:text-zinc-300 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer"
            />
            {newRecipe.image && (
              <div className="mt-3 relative inline-block border rounded-md dark:border-zinc-700">
                <img
                  src={newRecipe.image}
                  alt="Preview"
                  className="w-48 h-48 mx-auto object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setNewRecipe({ ...newRecipe, image: "" })}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Post Recipe
          </button>
        </form>

        {/* Recipe List */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            🥗 Your High-Protein Recipes
          </h2>
          {recipes.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              You haven't posted any recipes yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {recipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="p-6 border rounded-md dark:border-zinc-700 dark:bg-zinc-800 text-center"
                >
                  {recipe.image && (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-64 h-64 mx-auto object-contain rounded-md mb-4"
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
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => router.push("/home")}
          className="w-full p-3 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          View All Recipes
        </button>

        <button
          onClick={handleLogout}
          className="w-full p-3 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </main>
    </div>
  );
}