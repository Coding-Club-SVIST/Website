import React, { useState } from "react";
import { Bell, Send, Info } from "lucide-react";
import { notificationApi } from "@/lib/api";

const NotificationsTab: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setSending(true);
    setMessage(null);

    try {
      const payload: any = { title, body, url };
      if (userId.trim()) {
        payload.userId = parseInt(userId, 10);
      }
      await notificationApi.send(payload);
      setMessage({ type: "success", text: userId.trim() ? `Notification sent successfully to user ${userId}!` : "Notification sent successfully to all subscribers!" });
      setTitle("");
      setBody("");
      setUrl("");
      setUserId("");
    } catch (error) {
      console.error("Failed to send notification:", error);
      setMessage({ type: "error", text: "Failed to send notification. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Bell className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Browser Notifications</h2>
          <p className="text-slate-400 text-sm">Send push notifications to all opted-in users or a specific user</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target User ID (Optional)
                </label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., 123 (Leave empty for all users)"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-primary transition-colors"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., New Event Announced!"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Message Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="e.g., Join us for our upcoming workshop on React..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target URL (Optional)
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., /events/123"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-primary transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Users will be redirected to this URL when they click the notification.
                </p>
              </div>

              {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  <Info size={18} />
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !title || !body}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="card p-6 border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="text-primary" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {title || "Notification Title"}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {body || "This is how your notification message will appear to users on their desktop or mobile device."}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">website.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-slate-300">Tips for better engagement:</h4>
              <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                <li>Keep the title short and catchy.</li>
                <li>Be concise with the message body.</li>
                <li>Always provide a relevant URL if possible.</li>
                <li>Avoid sending too many notifications in a short period.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
