import { useEffect, useState } from 'react';
import calebImage from '../../assets/caleb.png';
import dahyaImage from '../../assets/dahya.png';
import isabelImage from '../../assets/isabel.png';
import kiranImage from '../../assets/kiran.png';
import linImage from '../../assets/lin.png';
import zoraImage from '../../assets/zora.png';

const puppetImages = {
  caleb: calebImage,
  dahya: dahyaImage,
  isabel: isabelImage,
  kiran: kiranImage,
  lin: linImage,
  zora: zoraImage,
};

export function PuppetNode({ name, role, imageName, side = 'left', isActive }) {
  const imageSrc = puppetImages[imageName];
  const isLeft = side === 'left';
  const [imageFailed, setImageFailed] = useState(false);
  const [stepX, setStepX] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const randomTime = Math.floor(Math.random() * 4000) + 3000;
    let jumpTimeout;
    const interval = setInterval(() => {
      const action = Math.random();

      if (action < 0.6) {
        const newStep = Math.floor(Math.random() * 11) - 5;

        if (newStep > stepX) {
          setIsFlipped(true);
        } else if (newStep < stepX) {
          setIsFlipped(false);
        }

        setStepX(newStep);
      } else if (action < 0.85) {
        setIsJumping(true);
        jumpTimeout = setTimeout(() => setIsJumping(false), 400);
      }
    }, randomTime);

    return () => {
      clearInterval(interval);
      clearTimeout(jumpTimeout);
    };
  }, [isActive, stepX]);

  const translateXPixels = stepX * 8;

  return (
    <div
      className="flex items-center transition-transform duration-200"
      style={{ transform: `translate(${translateXPixels}px, ${isJumping && isActive ? '-1rem' : '0'})` }}
    >
      {isLeft && (
        <div className="h-2.5 w-12 bg-gradient-to-b from-[#734423] via-[#a36a3e] to-[#4d2d15] border-y-2 border-[#3d291a] shadow-md -mr-2 z-0" />
      )}

      <div
        className={`flex flex-col items-center transition-transform duration-500 z-10 ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div
          className="relative bg-[#d4a373] p-1.5 border-2 border-[#3d291a] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all"
          style={{
            clipPath: 'polygon(8% 2%, 92% 0%, 98% 88%, 85% 100%, 10% 96%, 0% 12%)',
          }}
        >
          <div className="absolute inset-0 bg-[#c29263] opacity-25 mix-blend-multiply pointer-events-none" />

          {imageFailed || !imageSrc ? (
            <span className="relative z-10 flex h-20 w-20 items-center justify-center text-3xl font-black text-[#3d291a]">
              {name?.charAt(0) || '?'}
            </span>
          ) : (
            <img
              src={imageSrc.src}
              alt={name}
              onError={() => setImageFailed(true)}
              className="w-20 h-20 object-contain relative z-10 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.3)] pointer-events-auto cursor-zoom-in"
            />
          )}
        </div>

        <div
          className={`mt-1 bg-[#fdf6e3] border-2 border-[#3d291a] px-2 py-0.5 rounded shadow-[2px_2px_0px_rgba(0,0,0,0.4)] text-center z-20 whitespace-nowrap transition-transform duration-500 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          <p className="font-extrabold text-[#3d291a] text-[10px] leading-none uppercase">
            {name}
          </p>
          {role && (
            <p className="text-[8px] text-[#6b4f38] font-bold leading-none mt-0.5">
              {role}
            </p>
          )}
        </div>
      </div>

      {!isLeft && (
        <div className="h-2.5 w-12 bg-gradient-to-b from-[#734423] via-[#a36a3e] to-[#4d2d15] border-y-2 border-[#3d291a] shadow-md -ml-2 z-0" />
      )}
    </div>
  );
}
