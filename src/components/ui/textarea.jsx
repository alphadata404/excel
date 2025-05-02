export function Textarea({ value, onChange, placeholder, className, rows }) {
  return <textarea className={`border w-full p-2 ${className}`} rows={rows} placeholder={placeholder} value={value} onChange={onChange}></textarea>;
}
