
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import * as XLSX from "xlsx";

function SeedBatchGenerator() {
  const [entries, setEntries] = useState([]);
  const [rawText, setRawText] = useState("");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB").replace(/\//g, "/");
  const fileName = `SEEDS${today.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }).toUpperCase().replace(/ /g, "")}001.xlsx`;

  const parseAmount = (amountStr) => {
    const normalized = amountStr.toLowerCase().replace(/,/g, "");
    if (normalized.includes("lakh")) return parseFloat(normalized) * 100000;
    if (normalized.includes("k")) return parseFloat(normalized) * 1000;
    return parseFloat(normalized);
  };

  const parseRawText = () => {
    const lines = rawText.trim().split("\n");
    const parsed = lines.map(line => {
      const parts = line.split(" - ").map(p => p.trim());
      if (parts.length < 4) return null;
      const [name, account, ifsc, amountRaw] = parts;
      return {
        "Beneficiary Name": name,
        "Beneficiary Account Number": account,
        IFSC: ifsc.toUpperCase(),
        "Transaction Type": "NEFT",
        "Debit Account Number": "10225297219",
        "Transaction Date": dateStr,
        Amount: parseAmount(amountRaw),
        Currency: "INR",
        "Beneficiary Email ID": "",
        Remarks: "",
        "Custom Header – 1": "",
        "Custom Header – 2": "",
        "Custom Header – 3": "",
        "Custom Header – 4": "",
        "Custom Header – 5": ""
      };
    }).filter(e => e !== null);
    setEntries([...entries, ...parsed]);
    setRawText("");
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(entries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
  };

  const newBatch = () => {
    setEntries([]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SEED Batch Generator</h1>
      <Textarea
        className="w-full mb-4"
        rows={5}
        placeholder="Paste entries like: Name - Account - IFSC - Amount"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <div className="flex gap-4 mb-6">
        <Button onClick={parseRawText}>Add Entries</Button>
        <Button onClick={downloadExcel}>Download Excel</Button>
        <Button variant="destructive" onClick={newBatch}>New Batch</Button>
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr>
            {entries.length > 0 && Object.keys(entries[0]).map((header, i) => (
              <th key={i} className="border px-2 py-1 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, idx) => (
            <tr key={idx} className="border">
              {Object.values(entry).map((val, i) => (
                <td key={i} className="border px-2 py-1">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SeedBatchGenerator;
