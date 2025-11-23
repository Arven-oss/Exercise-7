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

interface Comment {
  recipeId: number;
  username: string;
  text: string;
  likes?: number;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [username, setUsername] = useState<string>("");
  const [sectionLikes, setSectionLikes] = useState<{ [key: number]: number }>({}); 
  const router = useRouter();

  // Load initial data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("loggedIn");
      if (loggedIn !== "true") router.push("/");

      const storedUsername = localStorage.getItem("username");
      if (!storedUsername) router.push("/");

      setUsername(storedUsername || "");

      const storedRecipes = JSON.parse(localStorage.getItem("all_recipes") || "[]");
      setRecipes(storedRecipes);

      const storedComments = JSON.parse(localStorage.getItem("recipe_comments") || "[]");
      setComments(storedComments);

      const storedSectionLikes = JSON.parse(localStorage.getItem("recipe_section_likes") || "{}");
      setSectionLikes(storedSectionLikes);
    }
  }, [router]);

  const handleAddComment = (recipeId: number) => {
    const text = newComment[recipeId]?.trim();
    if (!text) return;

    const updatedComments = [...comments, { recipeId, username, text }];
    setComments(updatedComments);
    localStorage.setItem("recipe_comments", JSON.stringify(updatedComments));
    setNewComment((prev) => ({ ...prev, [recipeId]: "" }));
  };

  const handleSectionLike = (recipeId: number) => {
    const current = sectionLikes[recipeId] || 0;
    const updated = { ...sectionLikes, [recipeId]: current + 1 };
    setSectionLikes(updated);
    localStorage.setItem("recipe_section_likes", JSON.stringify(updated));
  };

  const handleCommentLike = (c: Comment) => {
    const updatedComments = comments.map((comment) => {
      if (comment === c) return { ...comment, likes: (comment.likes || 0) + 1 };
      return comment;
    });
    setComments(updatedComments);
    localStorage.setItem("recipe_comments", JSON.stringify(updatedComments));
  };

  return (
    <main className="bg-zinc-100 dark:bg-zinc-900 min-h-screen">
      {/* Top Nav Bar */}
      <nav className="w-full bg-green-600 dark:bg-blue-700 p-4 fixed top-0 left-0 z-50 flex justify-between items-center shadow-md">
        <h1 className="text-white font-bold text-lg">🌎 High-Protein Recipes</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-3 py-1 bg-white text-blue-600 rounded-md hover:bg-zinc-100 transition"
          >
            Profile
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-col items-center pt-24 p-8">
        <div className="w-full flex justify-center mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-white text-green-600 dark:text-blue-700 rounded-md shadow-md hover:bg-zinc-100 transition"
          >
            What's on your recipe?
          </button>
        </div>

        <div className="w-full max-w-xl flex flex-col gap-6">
          {recipes.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              No recipes have been posted yet.
            </p>
          ) : (
            recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg shadow-md p-4">
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.title} className="w-full h-60 object-cover rounded-md mb-4" />
                )}

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {recipe.title} ({recipe.protein}g protein)
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  Posted by{" "}
                  <button
                    onClick={() => router.push(`/profile/${recipe.username}`)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {recipe.username}
                  </button>
                </p>

                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>

                <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                  <strong>Instructions:</strong> {recipe.instructions}
                </p>

                {/* Comment Section */}
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2 flex items-center gap-2">
                    {/* Section Like Button */}
                    <button
                      onClick={() => handleSectionLike(recipe.id)}
                      className="text-red-500 text-lg flex-shrink-0"
                    >
                      ❤️ {sectionLikes[recipe.id] || 0}
                    </button>
                    Comments
                  </h4>

                  {comments
                    .filter((c) => c.recipeId === recipe.id)
                    .map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-md mb-1 flex justify-between items-center"
                      >
                        <p className="text-sm text-zinc-900 dark:text-zinc-200">
                          <strong>
                            <button
                              onClick={() => router.push(`/profile/${c.username}`)}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {c.username}
                            </button>
                          </strong>
                          : {c.text}
                        </p>

                        {/* Per-comment like button */}
                        <button
                          onClick={() => handleCommentLike(c)}
                          className="ml-2 text-red-500 text-lg"
                        >
                          👍 {c.likes || 0}
                        </button>
                      </div>
                    ))}

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder={`Comment as ${username}`}
                      className="flex-1 p-2 border rounded-md bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                      value={newComment[recipe.id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [recipe.id]: e.target.value }))
                      }
                    />
                    <button
                      onClick={() => handleAddComment(recipe.id)}
                      className="px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Post
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}