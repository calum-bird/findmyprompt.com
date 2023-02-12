// File: lib/server/db/planetscale.ts
import { connect } from "@planetscale/database";
import { PromptObject } from "../../types";

const config = {
  host: process.env.PSCALE_HOST,
  username: process.env.PSCALE_USERNAME,
  password: process.env.PSCALE_PASSWORD,
  database: process.env.PSCALE_DATABASE,
};
const dbConn = connect(config);

export const getPrompt = async (id: string): Promise<PromptObject[]> => {
  const result = await dbConn.execute("SELECT * FROM prompts WHERE id = ?", [
    id,
  ]);
  if (result.rows.length === 0) {
    return [];
  }

  return result.rows.map((row: any) => {
    return {
      id: row.id,
      problem: row.problem,
      prompt: row.prompt,
    };
  });
};

export const getPrompts = async (ids: string[]): Promise<PromptObject[]> => {
  const result = await dbConn.execute("SELECT * FROM prompts WHERE id IN (?)", [
    ids,
  ]);

  if (result.rows.length === 0) {
    return [];
  }

  return result.rows.map((row: any) => {
    return {
      id: row.id,
      problem: row.problem,
      prompt: row.prompt,
    };
  });
};

export const getAllPrompts = async (limit: number): Promise<PromptObject[]> => {
  const result = await dbConn.execute("SELECT * FROM prompts LIMIT ?", [limit]);
  if (result.rows.length === 0) {
    return [];
  }

  return result.rows.map((row: any) => {
    return {
      id: row.id,
      problem: row.problem,
      prompt: row.prompt,
    };
  });
};

export const addPrompt = async (
  prompt: PromptObject,
  userId: string
): Promise<number | null> => {
  const result = await dbConn.execute(
    "INSERT INTO prompts (id, problem, prompt, userId) VALUES (?, ?, ?, ?)",
    [prompt.id, prompt.problem, prompt.prompt, userId]
  );

  return result.rowsAffected;
};
