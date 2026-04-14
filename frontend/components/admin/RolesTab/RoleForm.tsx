import { useState } from "react";
import { CustomRole, Permission } from "@/lib/types";
import { Save, X, Shield } from "lucide-react";

const PERMISSIONS = [
  { value: Permission.VIEW_DASHBOARD, label: "View Dashboard" },
  { value: Permission.MANAGE_MEMBERS, label: "Manage Members" },
  { value: Permission.MANAGE_PROJECTS, label: "Manage Projects" },
  { value: Permission.MANAGE_EVENTS, label: "Manage Events" },
  { value: Permission.MANAGE_SKILLS, label: "Manage Skills" },
  { value: Permission.MANAGE_TAGS, label: "Manage Tags" },
  { value: Permission.MANAGE_ROLES, label: "Manage Roles" },
  { value: Permission.SEND_NOTIFICATIONS, label: "Send Notifications"}
];

interface RoleFormProps {
  role: CustomRole | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, onSave, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    color: role?.color || "#6B7280",
    permissions: role?.permissions || [],
  });

  const togglePermission = (permission: Permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Role name is required");
      return;
    }
    if (formData.permissions.length === 0) {
      alert("At least one permission is required");
      return;
    }
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">
          {role ? "Edit Role" : "Create New Role"}
        </h3>
      </div>

      <div className="grid gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Role Name *
          </label>
          <input
            type="text"
            placeholder="Enter role name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe what this role can do..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Role Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
              className="w-12 h-12 rounded cursor-pointer border border-slate-600"
            />
            <span className="text-slate-400 text-sm font-mono">
              {formData.color}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Permissions *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {PERMISSIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.permissions.includes(value)}
                onChange={() => togglePermission(value)}
                className="w-4 h-4 rounded bg-slate-600 border-slate-500 text-primary focus:ring-primary focus:ring-2"
              />
              <span className="text-slate-300 text-sm flex-1">{label}</span>
            </label>
          ))}
        </div>
        <p className="text-slate-500 text-xs mt-2">
          {formData.permissions.length} permission(s) selected
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2 flex-1 py-3 sm:py-2"
        >
          <Save size={16} />
          {role ? "Update Role" : "Create Role"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center justify-center gap-2 flex-1 py-3 sm:py-2"
        >
          <X size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
}