import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-[var(--gray-1)]">
      {/* LHS */}
      <div className="hidden md:flex md:w-5/12 lg:w-7/12 p-2 overflow-hidden h-screen">
        {/* image */}
        <img
          src="https://images.unsplash.com/photo-1551921038-a9009c20adb3"
          alt="unsplash random image"
          className="object-cover w-full border rounded-lg h-full"
        />
      </div>
      {/* RHS */}
      <div className="w-full justify-center items-center self-center content-center md:w-6/12 px-8 sm:px-36 md:px-16 lg:px-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
