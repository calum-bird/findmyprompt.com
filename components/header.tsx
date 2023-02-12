// File: components/header.tsx
type HeaderProps = {};

export default function Header(props: HeaderProps) {
  return (
    <header className="px-10 md:px-20 text-left md:text-center mt-10">
      <h1 className="text-5xl md:text-3xl font-bold">FindMyPrompt</h1>
      <h2 className="text-3xl md:text-2xl mt-2 text-gray-800">
        Discover prompts for ChatGPT.
      </h2>
    </header>
  );
}
