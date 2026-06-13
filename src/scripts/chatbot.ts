import gsap from "gsap";

const CHATBOT_WEBHOOK_URL = "https://n8n.srv1237736.hstgr.cloud/webhook/alamin-chatbot";
const SESSION_STORAGE_KEY = "alamin-chatbot-session";

type ReplyRule = {
  keys: string[];
  answer: string;
};

const rules: ReplyRule[] = [
  {
    keys: ["service", "services", "offer", "kaj", "build", "development"],
    answer:
      "Mohammad Al Amin offers Laravel website development, Vue.js web apps, Next.js websites, Flutter mobile apps, n8n workflow automation, AI automation, and modern responsive UI/UX development."
  },
  {
    keys: ["skill", "skills", "laravel", "vue", "next", "flutter", "n8n", "automation", "ai"],
    answer:
      "His core stack includes Laravel, Vue.js, Next.js, Flutter, n8n Automation, AI Automation, and full-stack web development with clean responsive UI."
  },
  {
    keys: ["project", "projects", "portfolio", "work", "elaris", "physioprep", "artemesis"],
    answer:
      "Featured projects are Elaris, Physioprep AI, and the Artemesis Website. You can scroll to the Projects section or tap the View Projects button in the hero."
  },
  {
    keys: ["experience", "company", "job", "artemesis", "career"],
    answer:
      "He currently works as a Web Developer at Artemesis Company, building websites, web applications, mobile apps, and AI automation workflows."
  },
  {
    keys: ["study", "education", "student", "university", "madinah", "islamic"],
    answer:
      "He is a Computer Science student at Islamic University of Madinah, combining formal CS study with practical product development."
  },
  {
    keys: ["language", "languages", "bangla", "urdu", "hindi", "arabic", "english"],
    answer:
      "He can communicate in five languages: Bangla, Urdu, Hindi, Arabic, and English."
  },
  {
    keys: ["contact", "email", "hire", "available", "whatsapp", "linkedin", "github"],
    answer:
      "You can contact Mohammad Al Amin on WhatsApp at +966 53 231 3268, Facebook at facebook.com/md.alamin.0007, GitHub at mdalamin000007-coder, or LinkedIn at mohammad-alamin-7a2107392."
  },
  {
    keys: ["hello", "hi", "salam", "assalamu", "hey"],
    answer:
      "Hello. I am here to guide you through Mohammad Al Amin's portfolio. Ask me about his skills, projects, experience, languages, or contact options."
  }
];

const fallbackAnswer =
  "I can answer best about Mohammad Al Amin's services, projects, experience, education, languages, and contact details. Try asking about Laravel, Flutter, AI automation, or projects.";

const normalize = (value: string) => value.trim().toLowerCase();

const getSessionId = () => {
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
};

const getReply = (message: string) => {
  const normalized = normalize(message);
  const match = rules.find((rule) => rule.keys.some((key) => normalized.includes(key)));
  return match?.answer ?? fallbackAnswer;
};

const extractWebhookReply = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : data;
    const reply =
      item?.reply ??
      item?.answer ??
      item?.response ??
      item?.output ??
      item?.text ??
      item?.message ??
      item?.data?.reply ??
      item?.data?.answer;

    return typeof reply === "string" && reply.trim() ? reply.trim() : fallback;
  }

  const text = await response.text();
  return text.trim() || fallback;
};

const sendToWebhook = async (message: string) => {
  const fallback = getReply(message);

  const payload = {
    message,
    chatInput: message,
    sessionId: getSessionId(),
    source: "mohammad-al-amin-portfolio",
    pageUrl: window.location.href,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(CHATBOT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return fallback;
    return await extractWebhookReply(response, fallback);
  } catch {
    return fallback;
  }
};

const createMessage = (role: "bot" | "user", text: string, isTyping = false) => {
  const row = document.createElement("div");
  row.className = `chat-message ${role}${isTyping ? " typing" : ""}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;

  row.append(bubble);
  return row;
};

document.querySelectorAll<HTMLElement>("[data-chatbot]").forEach((widget) => {
  const panel = widget.querySelector<HTMLElement>("[data-chatbot-panel]");
  const toggle = widget.querySelector<HTMLButtonElement>("[data-chatbot-toggle]");
  const closeButton = widget.querySelector<HTMLButtonElement>("[data-chatbot-close]");
  const form = widget.querySelector<HTMLFormElement>("[data-chatbot-form]");
  const input = widget.querySelector<HTMLInputElement>("[data-chatbot-input]");
  const messages = widget.querySelector<HTMLElement>("[data-chatbot-messages]");
  const promptButtons = widget.querySelectorAll<HTMLButtonElement>("[data-chat-prompt]");

  if (!panel || !toggle || !form || !input || !messages) return;

  const scrollToLatest = () => {
    messages.scrollTo({ top: messages.scrollHeight, behavior: "smooth" });
  };

  const openChat = () => {
    widget.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    gsap.fromTo(panel, { y: 18, scale: 0.96, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.32, ease: "power3.out" });
    window.setTimeout(() => input.focus(), 160);
  };

  const closeChat = () => {
    gsap.to(panel, {
      y: 16,
      scale: 0.98,
      autoAlpha: 0,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
        widget.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  };

  // Sends every chat to the n8n webhook, then falls back to local portfolio answers if the webhook is unavailable.
  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message) return;

    messages.append(createMessage("user", message));
    input.value = "";
    scrollToLatest();

    const typing = createMessage("bot", "Typing...", true);
    messages.append(typing);
    scrollToLatest();

    window.setTimeout(async () => {
      const reply = await sendToWebhook(message);
      typing.remove();
      const response = createMessage("bot", reply);
      messages.append(response);
      gsap.from(response, { y: 10, autoAlpha: 0, duration: 0.24 });
      scrollToLatest();
    }, 420);
  };

  toggle.addEventListener("click", () => {
    if (widget.classList.contains("is-open")) {
      closeChat();
      return;
    }

    openChat();
  });

  closeButton?.addEventListener("click", closeChat);

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openChat();
      sendMessage(button.dataset.chatPrompt ?? button.textContent ?? "");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && widget.classList.contains("is-open")) {
      closeChat();
    }
  });
});
