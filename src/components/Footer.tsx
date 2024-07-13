import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-black dark:text-white py-4 mt-8 w-full">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p>&copy; 2024 Flexclub. Built with love on Base.</p>
          </div>
          <div className="text-sm">
            <a
              href="https://warpcast.com/~/channel/flexclub"
              className="hover:underline"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
