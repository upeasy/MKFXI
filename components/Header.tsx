import React from "react";

const Header = () => {
  return (
    <nav className="fixed w-full top-0 h-20 z-10">
      <div className="flex w-full bg-white/30 border-b border-gray-300/50 backdrop-blur-md  items-center justify-center gap-3 py-2 px-2 md:px-0">
        {/* <Image
          src={"/logo.png"}
          alt={"logo"}
          width={50}
          height={50}
          className="w-fit h-fit object-cover pointer-events-none"
        /> */}

        <h1
          className="text-2xl text-start md:text-4xl text-primary"
          style={{ fontFamily: "bd-font, sans-serif" }}
        >
          Photo Frame Maker
        </h1>
      </div>
    </nav>
  );
};

export default Header;
