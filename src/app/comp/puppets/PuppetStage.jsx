import { useState } from 'react';
import { PuppetNode } from './PuppetNode';

export function PuppetStage({ onSelectCharacter, onDoubleClickCharacter }) {
  const [selectedId, setSelectedId] = useState(null);

  const characters = [
    { id: 'kiran', characterId: 'kiran', name: 'Kiran', role: 'Paladín', imageName: 'kiran', side: 'left' },
    { id: 'caleb', characterId: 'caleb', name: 'Caleb', role: 'Berserker', imageName: 'caleb', side: 'left' },
    { id: 'lin', characterId: 'lin', name: 'Lin', role: 'Druida', imageName: 'lin', side: 'left' },
    
    { id: 'isabel', characterId: 'isabel', name: 'Isabel', role: 'Comodín', imageName: 'isabel', side: 'right' },
    { id: 'dahya', characterId: 'dahya', name: 'Dahya', role: 'Bárbara', imageName: 'dahya', side: 'right' },
    { id: 'zora', characterId: 'zora', name: 'Zora', role: 'Encantadora', imageName: 'zora', side: 'right' },
  ];

  const handleSelect = (char) => {
    setSelectedId(char.id);
    if (onSelectCharacter) onSelectCharacter(char);
  };

  const handleDoubleClick = (char) => {
    if (onDoubleClickCharacter) {
      onDoubleClickCharacter(char.characterId);
    } else if (onSelectCharacter) {
      // Fallback si no se pasa la función de doble clic
      onSelectCharacter(char);
    }
  };

  const leftCharacters = characters.filter((c) => c.side === 'left');
  const rightCharacters = characters.filter((c) => c.side === 'right');

  return (
    <div className="fixed inset-0 z-30 flex justify-between items-center px-4 md:px-8 pointer-events-none">
      
      {/* LADO IZQUIERDO */}
      <div className="flex flex-col gap-3 items-start pointer-events-auto">
        {leftCharacters.map((char) => (
          <PuppetNode
            key={char.id}
            name={char.name}
            role={char.role}
            imageName={char.imageName}
            side={char.side}
            isSelected={selectedId === char.id}
            onClick={() => handleSelect(char)}
            onDoubleClick={() => handleDoubleClick(char)}
          />
        ))}
      </div>

      {/* LADO DERECHO */}
      <div className="flex flex-col gap-3 items-end pointer-events-auto">
        {rightCharacters.map((char) => (
          <PuppetNode
            key={char.id}
            name={char.name}
            role={char.role}
            imageName={char.imageName}
            side={char.side}
            isSelected={selectedId === char.id}
            onClick={() => handleSelect(char)}
            onDoubleClick={() => handleDoubleClick(char)}
          />
        ))}
      </div>

    </div>
  );
}