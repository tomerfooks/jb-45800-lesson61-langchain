import { tool } from "@langchain/core/tools";
import { exec } from "child_process";
import { z } from "zod";

const runCommand = tool(
  async ({ command }: { command: string }) => {
    return new Promise<string>((resolve, reject) => {
      exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          resolve(`Exit code ${error.code ?? 1}\nstdout:\n${stdout}\nstderr:\n${stderr}`);
        } else if (stderr) {
          resolve(`stdout:\n${stdout}\nstderr:\n${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  },
  {
    name: "run_command",
    description: "Run a terminal command and return its output.",
    schema: z.object({
      command: z.string().describe("The shell command to execute"),
    }),
  }
);

export default runCommand;
