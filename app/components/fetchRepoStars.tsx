export async function getRepoStars(repo: string): Promise<number> {
  try {
    console.log(process.env.GITHUB_ACCESS_TOKEN);
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN}`,
      },
    });
    const data = await response.json();
    console.log(data);
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
