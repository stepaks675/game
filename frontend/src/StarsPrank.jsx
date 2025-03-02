import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
export const StarsPrank = () => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false)
  const [show, setShow] = useState(false)
  const prankster = () => {
    setLoading(true)
    setTimeout(()=>{setLoading(false) 
        setLoaded(true)},3000)
  };
  return (
    <div className="flex flex-col items-center justify-start gap-5">
      <button className="bg-white border-black border-4 rounded-xl px-8 py-3 text-2xl hover:scale-110 transition-all duration-200 min-w-[200px] flex items-center justify-center" onClick={prankster}>
        {loading ? <AiOutlineLoading className="animate-spin"/> : "FREE 100000 STARS"}
      </button>
    {loaded && <button className="bg-green-500 text-2xl px-6 py-3 animate-pulse cursor-pointer" onClick={()=>{
        setShow(true)
    }}> CLAIM STARS</button>}
    {show&& <div className="fixed l-1/2 top-1/4" onClick={()=>{setShow(false)}}><video 
        className="w-full h-full object-cover"
        autoPlay 
      >
        <source src="/assets/bruh.mp4" type="video/mp4" />
      </video></div>}
    </div>
  );
};
