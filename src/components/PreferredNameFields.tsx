"use client";

export function PreferredNameFields({
  firstName,
  usePreferredName,
  onUsePreferredNameChange,
  preferredName,
  onPreferredNameChange,
  inputId = "preferredName",
}: {
  firstName: string;
  usePreferredName: boolean;
  onUsePreferredNameChange: (checked: boolean) => void;
  preferredName: string;
  onPreferredNameChange: (value: string) => void;
  inputId?: string;
}) {
  return (
    <div>
      <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        How would you like us to address you?
      </p>

      {firstName && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          We&apos;ll call you{" "}
          <span className="font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
            {usePreferredName && preferredName ? preferredName : firstName}
          </span>
        </p>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={usePreferredName}
          onChange={(e) => {
            onUsePreferredNameChange(e.target.checked);
            if (e.target.checked && !preferredName) {
              onPreferredNameChange(firstName);
            }
          }}
          className="w-4 h-4 rounded border-[#E5E5E5] text-[#1F2A44] focus:ring-[#FFB957]"
        />
        <span className="text-sm text-slate-700 dark:text-slate-300">
          Use a preferred name for communications
        </span>
      </label>

      {usePreferredName && (
        <div className="mt-3 ml-6">
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Preferred name
          </label>
          <input
            id={inputId}
            type="text"
            value={preferredName}
            onChange={(e) => onPreferredNameChange(e.target.value)}
            className="input-magical"
            placeholder={firstName || "Preferred name"}
          />
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Travel documents will still use your legal name.
          </p>

          {preferredName && (
            <p className="mt-2 text-sm text-[#1F2A44] dark:text-[#FFB957] font-medium">
              Great! We&apos;ll call you &ldquo;{preferredName}&rdquo;!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
