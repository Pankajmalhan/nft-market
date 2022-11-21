import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ConnectButton from "./ConnectButton";
import { Web3Context } from "../context/Web3";

const PrettyNavBar = () => {
  const { network, isConnected } = useContext(Web3Context);

  const { pathname } = useRouter();

  const selectedItemClass =
    "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
  const otherItemClass =
    "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

  const [isShow, setIsShow] = useState(false);

  return (
    <nav className="bg-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <span className="font-medium leading-tight text-3xl mx-5 text-white font-extrabold">
                TFT
              </span>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <Link
                  href="/"
                  className={
                    pathname === "/" ? selectedItemClass : otherItemClass
                  }
                  aria-current="page"
                >
                  Marketplace
                </Link>

                <Link
                  href="/create"
                  className={
                    pathname === "/create" ? selectedItemClass : otherItemClass
                  }
                >
                  Create
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isConnected ? (
              <span className="bg-white border-2 rounded-lg shadow-lg px-2 text-md font-semibold">
                {" "}
                {network}{" "}
              </span>
            ) : (
              <></>
            )}

            <ConnectButton />

            {isConnected ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    onClick={() => setIsShow((prev) => !prev)}
                    className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://lumiere-a.akamaihd.net/v1/images/h_blackpanther_mobile_19754_57fe2288.jpeg?region=0,0,640,480"
                      alt=""
                    />
                  </button>
                </div>

                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  style={{
                    display: isShow === false ? "none" : "",
                  }}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={() => setIsShow((prev) => !prev)}
                  >
                    Your Profile
                  </Link>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PrettyNavBar;
