<script>
  
    let command = "";
  
    async function processCommand() {
      try {
        const response = await fetch("/api/calei", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          if (result.events) {
            console.log(result.events);
            console.log(`Fetched ${result.events.length} events.`);
          } else {
            console.log(result.message || "Action completed successfully!");
          }
        } else {
          console.log(result.error || "Failed to process command.");
        }
      } catch (error) {
        console.log("Error communicating with the assistant.");
      }
    }
  </script>
  
  <input type="text" bind:value={command} placeholder="Show my upcoming events" />
  <button on:click={processCommand}>Execute</button>
  