import { useEffect, useRef } from "react";

function useClickOutside(set) {
  const ref = useRef();
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) set(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ref;
}

export default useClickOutside;
