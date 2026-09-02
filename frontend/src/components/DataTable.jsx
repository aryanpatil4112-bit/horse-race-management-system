import React from 'react';
import { Inbox } from 'lucide-react';

export const DataTable = ({ columns, data, loading, emptyMessage = 'No records found.' }) => {
  if (loading) {
    return (
      <div className="glass-card empty-state">
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card empty-state">
        <Inbox size={40} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} style={{ width: col.width || 'auto' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
