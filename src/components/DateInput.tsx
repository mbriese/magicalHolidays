"use client";

import { useRef, useState, type InputHTMLAttributes } from "react";

const MAX_DATE = "2099-12-31";

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

export function DateInput({ value, onChange, max, className, ...rest }: DateInputProps) {
  const effectiveMax = max && max < MAX_DATE ? max : MAX_DATE;
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const validate = (input: HTMLInputElement) => {
    if (input.validity.rangeOverflow || input.validity.badInput) {
      setError("Please enter a date with a 4-digit year (2099 or earlier)");
      onChange("");
    } else {
      setError("");
      onChange(input.value);
    }
  };

  return (
    <div>
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => validate(e.target)}
        onInput={(e) => validate(e.target as HTMLInputElement)}
        onBlur={() => ref.current && validate(ref.current)}
        max={effectiveMax as string}
        className={`${className ?? "input-magical"} ${error ? "border-red-400! dark:border-red-500!" : ""}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
