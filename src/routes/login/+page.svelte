<script>
  import { Mail, Lock, Calendar } from "lucide-svelte";
  import banner from "../../assets/Calendify.png";
  import { signIn } from "@auth/sveltekit/client";

  let email = "";
  let password = "";

  function handleLogin() {}
  function handleGoogleLogin() {
    signIn("google",{callbackUrl: "/"});
  }

  
</script>

<div
  class="min-h-screen flex items-center justify-center bg-cover bg-center"
  style="background-image: url({banner});"
>
  <div class=" p-8 bg-white rounded-md shadow-xl w-full max-w-md">
    <div class="flex items-center justify-center mb-6">
      <Calendar class=" w-8 h-8 mr-2 bg-green-500" />
      <h1 class="text-3xl font-bold text-gray-800 0">Calendify</h1>
    </div>
    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <div class="relative">
          <Mail
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          />
          <input
            type="email"
            id="email"
            bind:value={email}
            class="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1">Password</label
        >
        <div class="relative">
          <Lock
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          />
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
      >
        Login
      </button>
    </form>
    <div class="mt-6">
      <button
        on:click={handleGoogleLogin}
        class="flex items-center justify-center w-full bg-white text-gray-700 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
      >
        <img
          class="w-5 h-5 object-contain mr-2"
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google logo"
        />
        Login with Google
      </button>
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
  }
</style>
