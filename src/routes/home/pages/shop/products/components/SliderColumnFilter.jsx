import { useMemo } from "react";

function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div className="d-flex">
      <input
        className="flex-fill form-range align-self-center px-2"
        type="range"
        min={min}
        max={max}
        step={Math.ceil(max / min).toString()}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <div className="flex-fill">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => setFilter(undefined)}
        >
          Off
        </button>
      </div>
    </div>
  );
}

export default SliderColumnFilter;
