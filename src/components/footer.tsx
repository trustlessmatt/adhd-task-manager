export const Footer = () => {
  return (
    <div className="py-5 px-5 flex items-center justify-between text-sm text-center">
      <p className="text-white">
        ✨ ADHD Task Manager is free and open source.{" "}
        <a
          href="https://github.com/trustlessmatt/adhd-task-manager"
          className="text-blue-500"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contributions are welcome!
        </a>
      </p>
    </div>
  );
};
