type HeaderProps = {
  isFocusedOnce: boolean;
};

export default function Header(props: HeaderProps) {
  const { isFocusedOnce } = props;

  return (
    <header
      className={
        (isFocusedOnce
          ? ""
          : "flex w-full flex-col items-center justify-center") +
        " px-10 md:px-20 text-left md:text-center mt-10"
      }
    >
      <h1 className="text-5xl md:text-3xl font-bold">FindMyPrompt</h1>
      <h2 className="text-3xl md:text-2xl mt-2 text-gray-800">
        Create and discover prompts for GPT.
      </h2>
    </header>
  );
}
