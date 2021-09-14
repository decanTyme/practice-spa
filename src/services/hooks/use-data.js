import { useEffect, useState } from "react";
import useNotifyService from "../providers/notification";
import useAuth from "./use-auth";
import useLocalStorage from "./use-local-storage";

const STATE_INIT = {
  isFetching: false,
  isDeleting: false,
  isAdding: false,
};

function useData() {
  const [storageData, setStorageData] = useLocalStorage("data");
  const [data, setData] = useState();
  const [status, setStatus] = useState(STATE_INIT);
  const auth = useAuth();
  const notifier = useNotifyService();

  const viewDataDetails = (itemId) => {
    if (storageData)
      storageData.forEach((item) => {
        if (item._id === itemId) {
          setData(item);
        }
      });
  };

  const fetchItems = async () => {
    setStatus({
      isFetching: true,
      isDeleting: false,
      isAdding: false,
    });

    return auth
      .fetchData()
      .then((data) => {
        setStorageData(data);
        return data;
      })
      .catch((error) => {
        setStorageData(null);
      })
      .finally(() => {
        setStatus(STATE_INIT);
      });
  };

  const addItem = async (item) => {
    setStatus({
      isFetching: false,
      isDeleting: false,
      isAdding: true,
    });

    auth
      .pushData(item)
      .then((response) => {
        if (response?.success) {
          return true;
        }
      })
      .catch((error) => {
        notifier.notify({
          title: "An error occured during saving",
          message: error.message,
        });
      })
      .finally(() => {
        setStatus(STATE_INIT);
      });
  };

  const deleteItem = async (itemId) => {
    setStatus({
      isFetching: false,
      isDeleting: true,
      isAdding: false,
    });
    auth
      .removeData(itemId)
      .then((response) => {
        if (!response.error) {
          setData(null);
        }
      })
      .catch((error) => {
        notifier.notify({
          title: "Error in deleting product",
          message: error.message,
        });
        setData(null);
      })
      .finally(() => setStatus(STATE_INIT));
  };

  useEffect(() => {
    setStatus({
      isFetching: true,
      isDeleting: false,
      isAdding: false,
    });

    auth
      .fetchData()
      .then((data) => {
        setStorageData(data);
      })
      .catch((error) => {
        setStorageData(null);
      })
      .finally(() => {
        setStatus(STATE_INIT);
      });

    //eslint-disable-next-line
  }, [status.isAdding, status.isDeleting]);

  return {
    storageData,
    data,
    viewDataDetails,
    fetchItems,
    addItem,
    deleteItem,
    isFetching: status.isFetching,
    isAdding: status.isAdding,
    isDeleting: status.isDeleting,
  };
}

export default useData;
