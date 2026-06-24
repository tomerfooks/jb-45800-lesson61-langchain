import { tool } from "@langchain/core/tools";
const getPosts = tool(
  async () => {
    const result = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data: any = await result.json()
    return data
  }, 
  {
    name: "getPosts",
    description: "Get a list of posts.",
  }
);
export default getPosts;