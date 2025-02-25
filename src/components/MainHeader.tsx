
const MainHeader = () => {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-2">
        Hi, I'm{" "}
        <span className="inline-block bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text">
          Jennie
        </span>
      </h1>
      <h2 className="text-4xl font-bold flex items-center gap-2">
        <span className="inline-block bg-gradient-to-r from-[#c795e6] to-[#9b87f5] text-transparent bg-clip-text">
          Promote
        </span>{" "}
        <span className="inline-block bg-gradient-to-r from-[#9b87f5] to-[#7d68aa] text-transparent bg-clip-text">
          anything
        </span>{" "}
        <span className="inline-block bg-gradient-to-r from-[#7E69AB] to-[#5d4d7e] text-transparent bg-clip-text">
          now
        </span>
      </h2>
    </div>
  );
};

export default MainHeader;
