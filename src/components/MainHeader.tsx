const MainHeader = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-4">
        Hi, I'm{" "}
        <span className="inline-block bg-gradient-to-r from-[#171721] via-[#8B4AAC] to-[#3E1DCE] text-transparent bg-clip-text">
          Jennie
        </span>
      </h1>
      <h2 className="text-4xl font-bold">
        Promote{" "}
        <span className="inline-block bg-gradient-to-r from-[#171721] via-[#8B4AAC] to-[#3E1DCE] text-transparent bg-clip-text">
          anything
        </span>
        <span className="ml-2 inline-block bg-gradient-to-r from-[#8B4AAC] to-[#3E1DCE] text-transparent bg-clip-text">
          now
        </span>
      </h2>
    </div>
  );
};

export default MainHeader;
