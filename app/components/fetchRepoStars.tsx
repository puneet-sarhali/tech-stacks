export async function getRepoStars(repo: string): Promise<number> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`);
    const data = await response.json();
    const { stargazers_count } = data;
    return stargazers_count;
  } catch (error: any) {
    console.error("Error fetching repository stars:", error.message);
    throw error;
  }
}

export default async function FetchRepoStars() {
  const stars = await getRepoStars("facebook/react");
  console.log("Stars:", stars);

  if (stars === null) {
    return <div>Loading...</div>;
  }

  return <div>fck</div>;
}
