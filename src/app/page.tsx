import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold mb-2">Welcome to Flexclub</h2>
      <p className="mb-4">
        Onchain goal based saving clubs. The fun way to save onchain!
      </p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Available Flexclubs</h2>
        <ul>
          <li>
            <Link href="/0xFlex001" className="text-blue-500 underline">
              Flexclub 001
            </Link>
          </li>
          <li>
            <Link href="/002" className="text-blue-500 underline">
              Flexclub 002
            </Link>
          </li>
          <li>
            <Link href="/003" className="text-blue-500 underline">
              Flexclub 003
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
