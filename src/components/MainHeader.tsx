
const MainHeader = () => {
  return (
    <div className="mb-12 animate-fade-in">
      <h1 className="text-6xl font-bold mb-4">
        Hi, I'm{" "}
        <span className="inline-block bg-gradient-to-r from-[#352F44] to-[#5C5470] text-transparent bg-clip-text">
          Jennie
        </span>
      </h1>
      <h2 className="text-6xl font-bold">
        Promote{" "}
        <span className="inline-block bg-gradient-to-r from-[#5C5470] to-[#B9B4C7] text-transparent bg-clip-text">
          anything{" "}
        </span>
        <span className="inline-block bg-gradient-to-r from-[#B9B4C7] to-[#352F44] text-transparent bg-clip-text">
          now
        </span>
      </h2>
    </div>
  );
};

export default MainHeader;
