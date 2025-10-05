import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="relative w-[250px] h-[250px] flex items-center justify-center">
      {/* Cloud - Front */}
      <div className="absolute z-[11] pt-[45px] ml-[25px] animate-clouds">
        <span className="inline-block w-[65px] h-[65px] rounded-[50%_50%_0_50%] bg-[#4c9beb] z-[5]" />
        <span className="inline-block w-[45px] h-[45px] rounded-[50%_50%_50%_0%] bg-[#4c9beb] ml-[-25px] z-[5]" />
      </div>

      {/* Sun */}
      <span className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-r from-[#fcbb04] to-[#fffc00] animate-sunshine opacity-60" />
      <span className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-r from-[#fcbb04] to-[#fffc00]" />

      {/* Cloud - Back */}
      <div className="absolute z-[12] mt-[-30px] ml-[150px] animate-clouds-slow">
        <span className="inline-block w-[30px] h-[30px] rounded-[50%_50%_0_50%] bg-[#4c9beb] z-[5]" />
        <span className="inline-block w-[50px] h-[50px] rounded-[50%_50%_50%_0%] bg-[#4c9beb] ml-[-20px] z-[5]" />
      </div>
    </div>
  );
};

export default Loader;
