<script>
    import { FlaskConical, Plus, Search, CircleX } from "lucide-svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
  
    let messages = [
      { sender: "Calei", text: "How can I assist you today?", isUser: false },
    ];
    let newMessage = "";
    let DisabledInput = false;
    export let onToggle = () => {};
  
    async function sendMessage() {
      if (newMessage.trim() !== "") {
        // Add user message to UI
        messages = [
          ...messages,
          {
            sender: $page?.data?.session?.user?.name || "You",
            text: newMessage,
            isUser: true,
          },
        ];
  
        let userCommand = newMessage;
        newMessage = "";
        DisabledInput = true;
  
        try {
          const response = await fetch("/api/calei", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ command: userCommand }),
          });
  
          const data = await response.json();
          if (response.ok) {
            messages = [
              ...messages,
              {
                sender: "Calei",
                text: data?.msg, 
                isUser: false,
              },
            ];
          } else {
            messages = [
              ...messages,
              { sender: "Calei", text: "Error: " + data.error, isUser: false },
            ];
          }
        } catch (error) {
          messages = [
            ...messages,
            { sender: "Calei", text: "An error occurred: " + error.message, isUser: false },
          ];
        } finally {
          DisabledInput = false;
        }
      }
    }

    $:console.log(messages , "messages")
  </script>
  
  <main class="w-full h-full chatbot fixed flex items-center justify-center">
    <div class="rounded shadow-lg bg-white relative">
      <div on:click={onToggle} class="close absolute -right-4 bg-white rounded-full -top-3 cursor-pointer z-20">
        <CircleX />
      </div>
      <div class="flex flex-col bg-background">
        <main class="flex-1 flex flex-col items-center justify-center p-4">
          <div class="w-full max-w-7xl space-y-2">
            <h1 class="text-2xl font-semibold text-center">
              I'm Calei, your Google Calendar Assistant
            </h1>
            <div class="w-full h-64 chat-message overflow-y-auto flex flex-col rounded-lg p-3">
              {#each messages as msg}
                <div class="flex w-full {msg.isUser ? 'justify-end' : 'justify-start'}">
                  <span class="px-4 py-1 w-[50%] text-gray-600 text-sm bg-white shadow-md" style="border-radius: 15px;">
                    <span class={msg.isUser ? "text-blue-500" : "text-green-500"}>{msg.sender}</span>: 
                    {#if msg.text?.events}
                        <div>{@html msg.text.events}</div>
                      {:else}
                        {msg.text}
                      {/if}
                  </span>
                </div>
              {/each}
            </div>
            <div class="p-2">
              <div class="relative">
                <div class="flex items-center gap-2 p-2 rounded-lg border bg-white">
                  <button class="shrink-0 p-2 hover:bg-gray-100 rounded-lg">
                    <Plus class="h-5 w-5" />
                  </button>
                  <input
                    disabled={DisabledInput}
                    bind:value={newMessage}
                    on:keydown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Ask about your schedule or book an event..."
                    class="flex-1 border-0 focus:outline-none focus:ring-0 px-2"
                  />
                  <div class="flex items-center gap-2">
                    <button class="p-2 hover:bg-gray-100 rounded-lg" on:click={sendMessage}>
                      <Search class="h-5 w-5" />
                    </button>
                    <button on:click={sendMessage} class="p-2 bg-black text-white rounded-full hover:bg-gray-800">
                      <FlaskConical class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p class="mt-1 text-xs text-gray-600">
                  * I can help you check your schedule, book events, and answer calendar-related questions.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </main>
  
  <style>
    .chat-message {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .chatbot {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      background-color: rgba(211, 211, 211, 0.5);
    }
    .w-full.h-64.overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: #e5e7eb transparent;
    }
    .w-full.h-64.overflow-y-auto::-webkit-scrollbar {
      width: 6px;
    }
    .w-full.h-64.overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }
    .w-full.h-64.overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: #e5e7eb;
      border-radius: 3px;
    }
  </style>
  