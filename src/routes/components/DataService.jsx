import useData from "../../services/hooks/use-data";
import { DataContext } from "../../services/providers/data";

function DataService({ children }) {
  const auth = useData();
  return <DataContext.Provider value={auth}>{children}</DataContext.Provider>;
}

export default DataService;
