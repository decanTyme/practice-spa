import { Toast } from "bootstrap";
import { useEffect, useState } from "react";

function useNotification() {
  const [data, setData] = useState();

  useEffect(() => {
    const toastElList = [].slice.call(document.querySelectorAll(".toast"));
    const toastList = toastElList.map((toastEl) => {
      return new Toast(toastEl);
    });

    if (data)
      toastList.forEach((toast) => {
        toast.show();
        setTimeout(() => setData(null), 6000);
      });

    return () =>
      toastList.forEach((toast) => {
        toast.dispose();
      });
  }, [data]);

  const notify = (data) => {
    setData(data);
  };

  return { data, notify };
}

export default useNotification;
