const PrettyFooter = () => {
  return (
    <div className="flex flex-col mt-20">
      <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-4 dark:bg-gray-900 max-h-28">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://www.tftus.com/"
            className="flex items-center mb-4 sm:mb-0"
          >
            <img
              src="https://www.tftus.com/wp-content/uploads/2021/01/logo-1.png"
              className="mr-3 h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              <h1 className=" text-2xl font-mono">TFT</h1>
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-2 border-gray-200 sm:mx-auto dark:border-gray-700" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2022{" "}
          <a href="https://www.tftus.com" className="hover:underline">
            Think Future Technology™
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
};

export default PrettyFooter;
