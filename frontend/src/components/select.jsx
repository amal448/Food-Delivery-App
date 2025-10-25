import * as React from "react"


export function SelectSearch({ data, value, onChange }) {
  return (
    <select
      className="border rounded-md p-2"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {data.map((item, idx) => (
        <option key={idx} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
