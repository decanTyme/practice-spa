import { createContext, useContext } from "react";

export const DataContext = createContext();

function useDataService() {
  return useContext(DataContext);
}

export default useDataService;
