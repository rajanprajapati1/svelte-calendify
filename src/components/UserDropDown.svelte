<script>
	import { signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div class="absolute flex text-left items-start flex-col -bottom-12 z-50 bg-gray-50 rounded shadow-2xl border right-4">
    <button class="py-1 px-4 w-full text-left hover:bg-gray-200 hover:rounded">Welcome , {$page?.data?.session?.user?.name}</button>
    <button class="py-1 px-4 w-full text-left hover:bg-gray-200 hover:rounded border-t" on:click={()=>signOut({callbackUrl:'/login'})}>Log Out</button>
</div>