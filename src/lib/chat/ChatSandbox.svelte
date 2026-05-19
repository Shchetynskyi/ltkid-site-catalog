<script lang="ts">
  import { goto } from '$app/navigation';

  type ChatResponse = {
    reply: string;
    next_question: string;
    show_gallery: boolean;
    gallery_group: string | null;
    diopter: string | null;
    intent: string | null;
    product_type: string | null;
    debug?: unknown;
  };

  let isOpen = false;
  let message = '';
  let isLoading = false;
  let error = '';
  let response: ChatResponse | null = null;

  const sessionId = `site-test-${Date.now()}`;

  async function sendMessage() {
    const text = message.trim();

    if (!text || isLoading) return;

    isLoading = true;
    error = '';
    response = null;

    try {
      const res = await fetch(`${import.meta.env.PUBLIC_CHAT_TEST_API_URL}/chat-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sandbox-Token': import.meta.env.PUBLIC_CHAT_TEST_SANDBOX_TOKEN
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          debug: true
        })
      });

      if (!res.ok) {
        throw new Error(`chat-test error ${res.status}`);
      }

      response = await res.json();
      message = '';
    } catch (err) {
      error = 'Чат-сервер не відповідає. Перевірте, чи запущений dialog-normalizer.';
    } finally {
      isLoading = false;
    }
  }

  function openGallery() {
    if (!response?.gallery_group) return;

    if (response.gallery_group === 'ready_minus') {
      goto('/gallery/ready/all/diopter/minus');
      return;
    }

    if (response.gallery_group === 'ready_plus') {
      goto('/gallery/ready/all/diopter/plus');
      return;
    }

    goto('/gallery/ready/all');
  }
</script>

<div class="chat-sandbox">
  {#if isOpen}
    <section class="chat-panel" aria-label="Тестовий чат">
      <div class="chat-header">
        <strong>Тестовий чат</strong>
        <button type="button" on:click={() => (isOpen = false)}>×</button>
      </div>

      <textarea
        bind:value={message}
        placeholder="Напишіть як клієнт..."
        rows="3"
      ></textarea>

      <button class="send-button" type="button" on:click={sendMessage} disabled={isLoading}>
        {isLoading ? 'Чекаємо...' : 'Надіслати'}
      </button>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      {#if response}
        <div class="answer">
          <p>{response.reply}</p>

          {#if response.next_question}
            <p>{response.next_question}</p>
          {/if}

          {#if response.show_gallery}
            <button class="gallery-button" type="button" on:click={openGallery}>
              Показати варіанти
            </button>
          {/if}

          <small>
            {response.intent} · {response.product_type} · {response.diopter}
          </small>
        </div>
      {/if}
    </section>
  {/if}

  <button class="chat-toggle" type="button" on:click={() => (isOpen = !isOpen)}>
    Чат
  </button>
</div>

<style>
  .chat-sandbox {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 100;
  }

  .chat-toggle {
    min-width: 72px;
    min-height: 52px;
    border: 0;
    border-radius: 999px;
    background: #111;
    color: #fff;
    font-size: 18px;
    font-weight: 800;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  .chat-panel {
    width: min(360px, calc(100vw - 32px));
    margin-bottom: 12px;
    padding: 14px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.22);
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .chat-header button {
    border: 0;
    background: transparent;
    font-size: 26px;
    line-height: 1;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 16px;
    resize: vertical;
  }

  .send-button,
  .gallery-button {
    width: 100%;
    margin-top: 10px;
    padding: 12px;
    border: 0;
    border-radius: 12px;
    background: #111;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }

  .gallery-button {
    background: #0b6bcb;
  }

  .answer {
    margin-top: 12px;
    padding: 12px;
    border-radius: 12px;
    background: #f3f4f6;
  }

  .answer p {
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 1.35;
  }

  .answer small {
    color: #555;
  }

  .error {
    color: #b00020;
    font-size: 14px;
  }
</style>
