// We need a separate file because of this issue: https://github.com/babel/babel/issues/2061
// Otherwise, all our code would be evaluated without having the envs properly
// set up, so things like a static stripe client creation wouldn't have access
// to the env vars from the .env file.
import { config } from "dotenv";

// First to come takes precedence as config() never overrides existing env vars.
config({ path: ".env.local" });
config();
