<script>
  let email = ''
  let showThanks = false

  function handleFormSubmit(event) {
    event.preventDefault()

    if (!email) {
      // handle error
      return
    }

    showThanks = true
    setTimeout(() => {
      showThanks = false
      email = ''
    }, 3000)
  }
</script>

<div
  id="newsletter"
  class="w-full max-w-3xl mx-auto p-4 md:p-8 bg-blue-500 text-white rounded-lg my-10"
>
  <h5 class="text-lg font-bold mb-4">Vill du få nyheter om Klimatkollen?</h5>
  <div class="grid gap-4 mb-4">
    <p>
      Med vårt nyhetsbrev får du uppdateringar om hur det går med utsläppen och
      omställningen direkt i din mejl.
    </p>
    <form
      on:submit={handleFormSubmit}
      class="flex items-center bg-white rounded-md overflow-hidden"
    >
      {#if showThanks}
        <div class="pl-4">Tack för ditt intresse!</div>
      {:else}
        <label class="sr-only" for="signup">Email</label>
        <input
          class="flex-1 p-2 text-gray-700"
          bind:value={email}
          type="email"
          placeholder="Ange mailadress"
          required
          disabled={showThanks}
          id="signup"
        />
        <button class="p-2 text-white">
          <img src="/icons/arrow-right-bold.svg" alt="Arrow-icon" />
        </button>
      {/if}
    </form>
  </div>
  <p class="text-sm">
    När du lämnat dina uppgifter kommer de att behandlas av Klimatbyrån ideell
    förening som står bakom Klimatkollen. Du har rätt till information om hur
    {' '}
    <a href="www.klimatkollen.se/privacy" class="underline"
      >dina personuppgifter behandlas</a
    >.
  </p>
</div>
