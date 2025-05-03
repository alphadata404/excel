import { useState } from "react";
import * as XLSX from "xlsx";

function SeedBatchGenerator() {
  const [entries, setEntries] = useState([]);
  const [rawText, setRawText] = useState("");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB").replace(/\//g, "/");
  const fileName = `SEEDS${today.toLocaleDateString("en-GB", { day: '2-digit', month: 'short' }).toUpperCase().replace(/ /g, "")}001.xlsx`;

  const parseAmount = (str) => {
    const clean = str.replace(/[^\d.kml]/gi, "").toLowerCase();
    if (clean.includes("l")) return parseFloat(clean) * 100000;
    if (clean.includes("k")) return parseFloat(clean) * 1000;
    return parseFloat(clean.replace(/,/g, "")) || 0;
  };

  const parseRawText = () => {
    const entriesParsed = [];
    const blocks = rawText.trim().split(/\n{2,}|\r{2,}/);

    for (const block of blocks) {
      let name = "", account = "", ifsc = "", amount = "";
      const lines = block.split(/\r?\n|\r/);

      for (const line of lines) {
        const l = line.trim();

        if (/^\D*\d{9,18}\D*$/.test(l)) account ||= l.replace(/\D/g, "");
        if (/ifsc/i.test(l)) ifsc ||= l.split(/[:\-]/).pop()?.trim().toUpperCase();
        if (/name|account holder/i.test(l)) name ||= l.split(/[:\-]/)[1]?.trim();
        if (/account/i.test(l) && !account) account ||= l.split(/[:\-]/)[1]?.replace(/\D/g, "").trim();
        if (/amount|inr|rs|₹|\d+[kml]/i.test(l)) amount ||= parseAmount(l);
        if (/^\d{5,}/.test(l)) account ||= l.trim();
        if (/\d+[kml]?/i.test(l) && !amount) amount ||= parseAmount(l);
      }

      if (!name) {
        const tabParts = lines[0].split(/[\t,]+|\s{2,}|\s(?=\d{5,})/);
        if (tabParts.length === 4) {
          name = tabParts[0].trim();
          account = tabParts[1].trim();
          ifsc = tabParts[2].trim().toUpperCase();
          amount = parseAmount(tabParts[3]);
        }
      }

      if (name && account && ifsc && amount) {
        entriesParsed.push({
          "Beneficiary Name": name,
          "Beneficiary Account Number": account,
          IFSC: ifsc,
          "Transaction Type": "NEFT",
          "Debit Account Number": "10225297219",
          "Transaction Date": dateStr,
          Amount: amount,
          Currency: "INR",
          "Beneficiary Email ID": "",
          Remarks: "",
          "Custom Header – 1": "",
          "Custom Header – 2": "",
          "Custom Header – 3": "",
          "Custom Header – 4": "",
          "Custom Header – 5": ""
        });
      }
    }

    if (entriesParsed.length === 0) {
      alert("Could not auto-detect valid entries. Make sure to include name, A/C, IFSC, and amount.");
    } else {
      setEntries([...entries, ...entriesParsed]);
      setRawText("");
    }
  };

  const downloadExcel = () => {
    if (entries.length === 0) {
      alert("No entries to export.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(entries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
  };

  const newBatch = () => {
    setEntries([]);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-indigo-600 text-white rounded-xl p-6 text-center shadow mb-6">
        <h1 className="text-3xl font-extrabold tracking-wide">OPTIMISM IDFC BULK PAYOUT</h1>
        <p className="text-sm font-light mt-1">Paste raw bank transfer details and generate Excel instantly</p>
      </div>

      <textarea
        className="w-full border border-indigo-300 rounded-lg p-3 mb-4 shadow-sm"
        rows={6}
        placeholder="Paste raw text with name, A/C, IFSC, and amount..."
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={parseRawText} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Add Entries</button>
        <button onClick={downloadExcel} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Download Excel</button>
        <button onClick={newBatch} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">New Batch</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300 shadow-sm">
          <thead className="bg-indigo-100">
            <tr>
              {entries.length > 0 && Object.keys(entries[0]).map((header, i) => (
                <th key={i} className="border px-2 py-1 text-left font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {Object.values(entry).map((val, i) => (
                  <td key={i} className="border px-2 py-1 text-gray-700">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeedBatchGenerator;
