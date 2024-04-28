import { useState } from "react";

const TableView = () => {
  const data = [
    [
      ["data1", "data2", "data3", "data4", "data5"],
      ["data1", "data2", "data3", "data4", "data5"]
    ],
    [
      ["data2", "data3", "data4", "data5", "data6"],
      ["data1", "data2", "data3", "data4", "data5"]
    ]
  ]

  const [displayedWeek, setDisplayedWeek] = useState(1);

  function nextWeek() {
    const nextWeek = displayedWeek + 1 < data.length ? displayedWeek + 1 : displayedWeek;
    setDisplayedWeek(nextWeek);
  }

  function prevWeek() {
    const prevWeek = displayedWeek - 1 >= 0 ? displayedWeek - 1 : displayedWeek;
    setDisplayedWeek(prevWeek);
  }

  function populateTable() {
    for (let i = 0; i < 28; i++) {
      const newShift = {
        week: (i / 7) + 1,
        date: new Date(Date.UTC(2024, 3, i + 1, 12)).toISOString()
      }
      fetch(`/api/shifts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newShift),
      }).then((response) => {
        console.log("created shift", i)
      }).catch(() => {
        console.log("Error")
      })
    }

  }

  return (
    <div className="flex flex-col items-start">
      <div className="flex items-start space-x-4 my-4">
        <button onClick={prevWeek}>Prev</button>
        <p>Week {displayedWeek + 1}</p>
        <button onClick={nextWeek}>Next</button>
      </div>
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
          {
            data[displayedWeek].map((rowData, ind) => {
              return (
                <tr key={ind}>
                  {rowData.map((itemData, ind) => {
                    return (
                      <td key={ind} className="border border-gray-200 px-4 py-2">{itemData}</td>
                    )
                  })}
                </tr>
              )
            })
          }
          {/* <tr>
            <td className="border border-gray-200 px-4 py-2">Data 1</td>
            <td className="border border-gray-200 px-4 py-2">Data 2</td>
            <td className="border border-gray-200 px-4 py-2">Data 3</td>
            <td className="border border-gray-200 px-4 py-2">Data 4</td>
            <td className="border border-gray-200 px-4 py-2">Data 5</td>
          </tr> */}
          {/* Additional rows can be added here */}
        </tbody>
      </table>
      {/* <button onClick={populateTable}>
        Click me!
      </button> */}
    </div>
  );
};

  export default TableView;