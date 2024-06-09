import styles from "./Button.module.scss";

const Button = ({ children, onClick, className, style={} }) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      style={{ ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
