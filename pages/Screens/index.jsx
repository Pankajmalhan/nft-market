import React from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { NftDetails, NftMain } from "./NftMarket";
import Form from "../../components/Form";

export const ScreenRoute = () => {
  return (
      <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/Marketplace" element={<NftMain />} />
        <Route path="/Create" element={<NftDetails />} />
        {/* <Route path='*' element={<Main/>} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
};