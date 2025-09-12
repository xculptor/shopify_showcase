import { useEffect, useState } from "react";

const useScreenDimension = (container) => {
  const [inH, setInH] = useState();
  const [inW, setInW] = useState();

  useEffect(() => {
    if (container.current) {
      setInH(container.current.clientHeight);
      setInW(container.current.clientWidth);
    }
  }, [container]);

  return { inH, inW, setInH, setInW };
};

export default useScreenDimension;
