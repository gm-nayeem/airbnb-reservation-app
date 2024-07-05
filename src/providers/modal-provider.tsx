"use client";

import RentModal from "@/components/modals/rent-modal";
import LoginModal from "@/components/modals/login-modal";
import SearchModal from "@/components/modals/serarch-modal";
import RegisterModal from "@/components/modals/register-modal";

const ModalsProvider = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <SearchModal />
      <RentModal />
    </>
  );
};

export default ModalsProvider;
