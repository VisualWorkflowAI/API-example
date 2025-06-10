import fetch from "node-fetch";

const endpoint = "https://www.visualworkflow.app/api/trigger/yourworkflowid";
const apiKey = "yourapikey";
const data = {
  payload: {
    message: "your input message",
  },
};

async function callWorkflow() {
  console.log(`Calling workflow API: ${endpoint}`);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        Accept: "text/event-stream",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`);
      console.error("Server response:", errorText);
      return;
    }

    if (!response.body) {
      console.error("Error: Response body is null.");
      return;
    }

    console.log("API call successful, processing stream...\n");

    let accumulatedAIDelta = "";
    let finalOutputContent = null;
    const toolResults = [];
    const workflowLogs = [];
    let workflowStarted = false;
    let workflowCompleted = false;

    const decoder = new TextDecoder();
    let buffer = "";

    for await (const chunk of response.body) {
      buffer += decoder.decode(chunk, { stream: true });

      let eolIndex;
      while ((eolIndex = buffer.indexOf("\n\n")) >= 0) {
        const eventString = buffer.substring(0, eolIndex).trim();
        buffer = buffer.substring(eolIndex + 2);

        if (eventString.startsWith("data: ")) {
          try {
            const jsonData = eventString.substring(5);
            const event = JSON.parse(jsonData);

            switch (event.type) {
              case "workflow_started":
                workflowStarted = true;
                break;
              case "ai_delta":
                if (event.delta) accumulatedAIDelta += event.delta;
                break;
              case "final_output":
                finalOutputContent = event.content;
                break;
              case "ai_tool_result":
                toolResults.push({
                  toolName: event.toolName,
                  result: event.result,
                });
                break;
              case "workflow_log":
                workflowLogs.push(
                  `   [${event.level || "info"}] ${event.message}`
                );
                break;
              case "workflow_error":
                console.error(
                  `   Workflow Error Event: ${event.message} (NodeID: ${
                    event.nodeId || "N/A"
                  })`
                );
                break;
              case "workflow_all_paths_completed":
                workflowCompleted = true;
                break;
            }
          } catch (e) {}
        }
      }
    }
    if (buffer.trim().startsWith("data: ")) {
      try {
        const jsonData = buffer.trim().substring(5);
        const event = JSON.parse(jsonData);
        switch (event.type) {
          case "ai_delta":
            if (event.delta) accumulatedAIDelta += event.delta;
            break;
          case "final_output":
            finalOutputContent = event.content;
            break;
        }
      } catch (e) {}
    }

    console.log("\n--- Workflow Execution Summary ---");

    if (workflowLogs.length > 0) {
      console.log("\n Workflow Logs:");
      workflowLogs.forEach((log) => console.log(log));
    }

    if (toolResults.length > 0) {
      console.log("\n Tool Results Captured:");
      toolResults.forEach((tr) => {
        console.log(`   - Tool: ${tr.toolName}`);
        console.log(
          `     Result: ${
            typeof tr.result === "object"
              ? JSON.stringify(tr.result, null, 2)
                  .split("\n")
                  .map((l) => `       ${l}`)
                  .join("\n")
              : tr.result
          }`
        );
      });
    }

    if (finalOutputContent) {
      console.log("\nFinal Output (from Output Node):");
      if (typeof finalOutputContent === "object") {
        console.log(JSON.stringify(finalOutputContent, null, 2));
      } else {
        console.log(finalOutputContent);
      }
    } else if (accumulatedAIDelta) {
      console.log("\n Assembled AI Response (from AI Agent):");
      console.log(accumulatedAIDelta.trim());
    } else {
      console.log(
        "\n No specific final output or AI delta captured. The workflow may have completed without generating text or a designated output."
      );
    }

    if (workflowStarted && workflowCompleted) {
      console.log("\n Workflow started and completed successfully.");
    } else if (workflowStarted) {
      console.log(
        "\n Workflow started but completion event was not explicitly captured in this summary."
      );
    } else {
      console.log("\n Workflow status unclear from captured events.");
    }
  } catch (error) {
    console.error(" Request Failed:", error.message);
    if (error.cause) {
      console.error("   Cause:", error.cause);
    }
  }
}

callWorkflow();
