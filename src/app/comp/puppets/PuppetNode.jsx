import { useState, useEffect } from 'react';
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

export function PuppetNode({
  name,
  role,
  imageName,
  side = 'left',
  onClick,
  onDoubleClick,
  isSelected,
}) {
  const imageSrc = puppetImages[imageName];
  const isLeft = side === 'left';
  const [imageFailed, setImageFailed] = useState(false);

  // Estados de animación
  const [stepX, setStepX] = useState(0); // Pasos en X (-5 a +5)
  const [isFlipped, setIsFlipped] = useState(false); // Mirar a izq/der
  const [isJumping, setIsJumping] = useState(false); // Saltito

  useEffect(() => {
    // Intervalo aleatorio entre 3 y 7 segundos por títere
    const randomTime = Math.floor(Math.random() * 4000) + 3000;

    const interval = setInterval(() => {
      const action = Math.random();

      if (action < 0.6) {
        // 60% prob: Dar de -5 a +5 pasos de distancia
        const newStep = Math.floor(Math.random() * 11) - 5;
        
        if (newStep > stepX) {
          setIsFlipped(true);  // Camina a la derecha
        } else if (newStep < stepX) {
          setIsFlipped(false); // Camina a la izquierda
        }

        setStepX(newStep);
      } else if (action < 0.85) {
        // 25% prob: Saltito artesanal
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 400);
      }
    }, randomTime);

    return () => clearInterval(interval);
  }, [stepX]);

  // Convertimos los pasos en desplazamiento en píxeles
  const translateXPixels = stepX * 8; 
return (
    <div 
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`cursor-pointer transition-all duration-200 flex items-center ${
        isSelected ? 'scale-110' : 'hover:scale-105'
      } ${isJumping ? '-translate-y-4' : ''}`}
      style={{ transform: `translateX(${translateXPixels}px)` }}
    > 
      {/* 1. VARA LATERAL IZQUIERDA (Sale hacia la pared de la izquierda) */}
      {isLeft && (
        <div className="h-2.5 w-12 bg-gradient-to-b from-[#734423] via-[#a36a3e] to-[#4d2d15] border-y-2 border-[#3d291a] shadow-md -mr-2 z-0" />
      )}

      {/* CONTENEDOR PRINCIPAL CON FLIP */}
      <div 
        className={`flex flex-col items-center transition-transform duration-500 z-10 ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* CARTÓN BASE */}
        <div 
          className="relative bg-[#d4a373] p-1.5 border-2 border-[#3d291a] shadow-[4px_4px_0px_rgba(0,0,0,0.4)] flex items-center justify-center transition-all"
          style={{
            clipPath: 'polygon(8% 2%, 92% 0%, 98% 88%, 85% 100%, 10% 96%, 0% 12%)',
          }}
        >
          <div className="absolute inset-0 bg-[#c29263] opacity-25 mix-blend-multiply pointer-events-none" />

          {/* ILUSTRACIÓN */}
          {imageFailed || !imageSrc ? (
            <span className="relative z-10 flex h-20 w-20 items-center justify-center text-3xl font-black text-[#3d291a]">
              {name?.charAt(0) || '?'}
            </span>
          ) : (
            <img
              src={imageSrc.src}
              alt={name}
              onError={() => setImageFailed(true)}
              className="w-20 h-20 object-contain relative z-10 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.3)] pointer-events-none"
            />
          )}
        </div>

        {/* ETIQUETA DE NOMBRE Y ROL */}
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

      {/* 2. VARA LATERAL DERECHA (Sale hacia la pared de la derecha) */}
      {!isLeft && (
        <div className="h-2.5 w-12 bg-gradient-to-b from-[#734423] via-[#a36a3e] to-[#4d2d15] border-y-2 border-[#3d291a] shadow-md -ml-2 z-0" />
      )}
    </div>
  );
}