import React from 'react';

interface TableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, rows, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};