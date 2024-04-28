const TableView = () => {
    return (
      <div className="flex justify-center">
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Column 1</th>
              <th className="border border-gray-200 px-4 py-2">Column 2</th>
              <th className="border border-gray-200 px-4 py-2">Column 3</th>
              <th className="border border-gray-200 px-4 py-2">Column 4</th>
              <th className="border border-gray-200 px-4 py-2">Column 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Data 1</td>
              <td className="border border-gray-200 px-4 py-2">Data 2</td>
              <td className="border border-gray-200 px-4 py-2">Data 3</td>
              <td className="border border-gray-200 px-4 py-2">Data 4</td>
              <td className="border border-gray-200 px-4 py-2">Data 5</td>
            </tr>
            {/* Additional rows can be added here */}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TableView;