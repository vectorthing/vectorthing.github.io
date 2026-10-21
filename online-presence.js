import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.VECTORTHING_PRESENCE_CONFIG || {};
const countElement = document.querySelector("#online-count");
const countLabel = document.querySelector("#online-count-label");
const statusElement = document.querySelector("#online-status");
const visitorKeyName = "vectorthing.presence-visitor.v1";
const isConfigured = config.supabaseUrl && config.supabaseAnonKey
  && !config.supabaseUrl.includes("PASTE_")
  && !config.supabaseAnonKey.includes("PASTE_");

function setStatus(message, state = "") {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.dataset.state = state;
}

function showCount(count) {
  if (!countElement || !countLabel) return;
  countElement.textContent = count.toLocaleString();
  countLabel.textContent = count === 1 ? "visitor online" : "visitors online";
}

function getVisitorKey() {
  try {
    let visitorKey = localStorage.getItem(visitorKeyName);
    if (!visitorKey) {
      visitorKey = crypto.randomUUID();
      localStorage.setItem(visitorKeyName, visitorKey);
    }
    return visitorKey;
  } catch {
    return crypto.randomUUID();
  }
}

if (!isConfigured) {
  if (countLabel) countLabel.textContent = "setup required";
  setStatus("Add your Supabase project URL and public key to online-config.js to activate the live count.", "error");
} else {
  try {
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    const channel = supabase.channel("vectorthing-online-users", {
      config: { presence: { key: getVisitorKey() } }
    });

    const updatePresenceCount = () => {
      const count = Object.keys(channel.presenceState()).length;
      showCount(count);
    };

    channel
      .on("presence", { event: "sync" }, updatePresenceCount)
      .on("presence", { event: "join" }, updatePresenceCount)
      .on("presence", { event: "leave" }, updatePresenceCount)
      .subscribe(async (state) => {
        if (state === "SUBSCRIBED") {
          await channel.track({ online: true });
          setStatus("Live count is updating automatically.");
        } else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
          setStatus("Could not connect to the live counter. Check the Supabase URL, key, and Realtime settings.", "error");
        } else if (state === "CLOSED") {
          setStatus("The live counter connection has closed. Refresh to reconnect.", "error");
        }
      });
  } catch {
    if (countLabel) countLabel.textContent = "unavailable";
    setStatus("Could not start the live counter. Check online-config.js and try again.", "error");
  }
}