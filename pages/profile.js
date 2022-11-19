import { Col, Row } from "antd";
import { useState, useEffect, useContext } from "react";
import MarketPlace from "../components/MarketPlace";

const Profile = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 class="my-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900">
        Your <span class="text-blue-600 dark:text-blue-500">NFTs.</span>
      </h1>
      <MarketPlace />
    </div>
  );
};

export default Profile;
