import { useState } from "react";
import { Game } from "./Game";
import { StarsPrank } from "./StarsPrank";

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <>
      <div></div>
      <div
        className="w-screen h-screen flex justify-center items-center object-cover"
        style={{
          backgroundImage: "url('/assets/bg.webp')",
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat", 
        }}
      >
        <div className="flex flex-col items-center">
          <div className="bg-gray-300 h-8 w-[1616px] text-xl text-center">
            {" "}
            SUCCINT RUNNER by stepaks675
          </div>
          <div className="flex">
            <div className="w-[150px] flex flex-col gap-10 items-center justify-start">
              <div className="font-bold text-3xl">LEGENDS</div>
              <Block img="assets/stepaks.jpg" link="https://x.com/stepaks576" />
              <Block img="assets/suc.jpg" link="https://x.com/SuccinctLabs" />
              <Block img="assets/yinger.jpg" link="https://x.com/0xCRASHOUT" />
              <Block
                img="assets/addidy.jpg"
                link="https://x.com/nair_advaith"
              />
              <Block img="assets/uma.jpg" link="https://x.com/pumatheuma" />
            </div>
            <Game setPlaying={setIsPlaying}/>
            <div className="w-[150px] flex flex-col gap-10 items-center justify-start">
              <div className="font-bold text-3xl">FRENZ</div>
              <Block img="assets/over.jpg" link="https://x.com/DDenicah" />
              <Block
                img="assets/fleece.jpg"
                link="https://x.com/Fleece654199"
              />
              <Block
                img="assets/godbless.jpg"
                link="https://x.com/CryptoH0lly"
              />
              <Block img="assets/lumin.jpg" link="https://x.com/lumincrypto" />
              <Block img="assets/saigon.jpg" link="https://x.com/SaiMoo_n" />
            </div>
          </div>
          {!isPlaying && <StarsPrank/>}
        </div>
      </div>
    </>
  );
}

const Block = ({ img, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="h-[80px] w-[80px] hover:scale-110 cursor-pointer transition-all duration-300 border-4 border-yellow-300">
        <img src={img} alt="" className="h-full w-full object-cover" />
      </div>
    </a>
  );
};
export default App;
