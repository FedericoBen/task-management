import { forwardRef, useEffect, useMemo, useState } from "react";
import styles from "./Input.module.scss";
import { useRef } from "react";

const Input = forwardRef(function (
  { name, value = undefined, onChange = () => {}, ...props },
  ref
) {
  const inputRef = useRef();
  const [active, setActive] = useState(false);

  const restartInput = (e) => {
    const input = inputRef.current;
    if (!input.value && !e.composedPath().includes(input)) {
      setActive(false);
    }
  };

  const stylesActive = useMemo(
    () => ({
      top: `${active ? -16 : 4}px`,
      fontSize: `${active ? 12 : 16}px`,
      left: `7px`,
    }),
    [active]
  );

  useEffect(() => {
    if (!inputRef.current?.value) setActive(false);
  }, []);

  useEffect(() => {
    document.body.addEventListener("click", restartInput);
    return () => {
      document.body.removeEventListener("click", restartInput);
    };
  }, []);

  return (
    <label className={styles.container_input} onClick={() => setActive(true)}>
      <span style={{ ...stylesActive }} className={styles.placeholder}>
        Ingresa un valor
      </span>
      <input
        {...props}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        ref={(input) => {
          if (typeof ref === "function") ref?.(input);
          else if (ref) {
            ref.current = input;
          }
          inputRef.current = input;
        }}
      />
    </label>
  );
});

export default Input;
