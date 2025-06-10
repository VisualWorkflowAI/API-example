# Workflow API Script

This Node.js script (`index.js`) is designed to call a workflow API endpoint that streams Server-Sent Events (SSE). It processes this stream to provide a formatted summary of the workflow's execution, including logs, tool results, and the final output or AI-generated response.

---

## Purpose

When a workflow is triggered via an API call (e.g., using an "API Trigger" node), the workflow engine often returns a stream of events detailing each step of the execution. This script helps in:

- Making the API request to trigger the workflow.
- Listening to the Server-Sent Events (SSE) stream.
- Parsing individual events (logs, AI deltas, tool calls, final outputs).
- Consolidating and formatting this information into a human-readable summary.
- Demonstrating how to interact with and interpret the output of streaming workflow APIs programmatically.

---

## Prerequisites

- Node.js (v16.x or later recommended)
- npm (Node Package Manager, comes with Node.js)

---

## Installation

1. **Clone or Download:**
   Ensure you have the `index.js` script in your project directory.

2. **Install Dependencies:**
   The script uses [`node-fetch`](https://www.npmjs.com/package/node-fetch) to make HTTP requests and handle streams.

   ```bash
   npm install node-fetch or npm install
   ```

---

## Configuration

Edit the top of the `index.js` file with your specific details:

```js
// --- Your Configuration ---
const endpoint = "http://localhost:3000/api/trigger/YOUR_WORKFLOW_ID";
const apiKey = "YOUR_API_KEY";
const data = {
  payload: {
    message: "Your input message or data for the workflow",
  },
};
// --- End Configuration ---
```

- `endpoint`: Full URL to your workflow trigger API (including workflow ID).
- `apiKey`: API key for authentication (sent as `X-API-Key` header).
- `data`: JSON payload required by the workflow's "API Trigger" node.

---

## Usage

Once configured, run the script from the terminal:

```bash
node index.js
```

---

## Output Explanation

The script outputs:

- API call status messages
- Real-time workflow logs
- Tool results (if applicable)
- Final output or AI agent response
- Summary of workflow status (start, completion, errors)

**Example output:**

```
Calling workflow API: http://localhost:3000/api/trigger/...
API call successful, processing stream...

--- Workflow Execution Summary ---

Workflow Logs:
   [info] Starting execution of path: path0 from node ...
   [info] AI Agent ... roundtrip 1. Tools: ...

Tool Results Captured:
   - Tool: sol_get_token_balances
     Result: { ...token data... }

Assembled AI Response (from AI Agent):
The wallet balance for the address ... is as follows: ...

Workflow started and completed successfully.
```

---

## How It Works

- Uses `node-fetch` to send a `POST` request with `Accept: text/event-stream`.
- Processes `response.body` as an asynchronous iterable stream using `for await`.
- Parses SSE messages:

  - Buffers raw stream into events
  - Extracts JSON after `data:` prefix
  - Switches on `type` to handle:

    - `ai_delta`
    - `workflow_log`
    - `tool_result`
    - `final_output`

After the stream ends, it prints a summarized and formatted output.

---

## Troubleshooting

| Issue                            | Solution                                                                   |
| -------------------------------- | -------------------------------------------------------------------------- |
| Request Failed                   | Check if your server is running and the endpoint URL is correct.           |
| 401 Unauthorized / 403 Forbidden | Verify `apiKey` is correct and sent in `X-API-Key` header.                 |
| 400 Bad Request                  | Ensure `data.payload` matches your workflow's expected structure.          |
| No Output or Incomplete Output   | Workflow may not emit expected event types. Check server-side logs.        |
| Stream Errors                    | Ensure you are using Node.js v16+ and `node-fetch` is installed correctly. |

---

## Contributions

Feel free to open an issue or submit a pull request to improve this script.

```

```
