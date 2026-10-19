'use client';

import { useEffect, useRef, useState } from 'react';
import { PuppetNode } from './PuppetNode';

const characters = [
  { id: 'kiran', name: 'Kiran', role: 'Paladín', imageName: 'kiran', side: 'left' },
  { id: 'caleb', name: 'Caleb', role: 'Berserker', imageName: 'caleb', side: 'left' },
  { id: 'lin', name: 'Lin', role: 'Druida', imageName: 'lin', side: 'left' },
  { id: 'isabel', name: 'Isabel', role: 'Comodín', imageName: 'isabel', side: 'right' },
  { id: 'dahya', name: 'Dahya', role: 'Bárbara', imageName: 'dahya', side: 'right' },
  { id: 'zora', name: 'Zora', role: 'Encantadora', imageName: 'zora', side: 'right' },
];

export function PuppetStage() {
  const [isVisible, setIsVisible] = useState(false);
  const [puppetSession, setPuppetSession] = useState(0);
  const closingTimeout = useRef(null);
  const leftCharacters = characters.filter((character) => character.side === 'left');
  const rightCharacters = characters.filter((character) => character.side === 'right');

  useEffect(() => () => clearTimeout(closingTimeout.current), []);

  const togglePuppets = () => {
    const isClosing = closingTimeout.current !== null;
    clearTimeout(closingTimeout.current);
    closingTimeout.current = null;

    if (isVisible) {
      setIsVisible(false);
      closingTimeout.current = setTimeout(() => {
        setPuppetSession((session) => session + 1);
        closingTimeout.current = null;
      }, 750);
      return;
    }

    if (isClosing) setPuppetSession((session) => session + 1);
    setIsVisible(true);
  };

  const renderCharacters = (group, side) => (
    <div
      className={`puppet-stage-group puppet-stage-${side} ${isVisible ? 'is-visible' : ''}`}
      aria-hidden={!isVisible}
    >
      {group.map((character) => (
        <PuppetNode
          key={`${character.id}-${puppetSession}`}
          name={character.name}
          role={character.role}
          imageName={character.imageName}
          side={character.side}
          isActive={isVisible}
        />
      ))}
    </div>
  );

  return (
    <div className="puppet-stage">
      <div id="puppet-stage" className="puppet-stage-display">
        {renderCharacters(leftCharacters, 'left')}
        {renderCharacters(rightCharacters, 'right')}
      </div>
      <button
        type="button"
        className="puppet-stage-toggle"
        aria-label={isVisible ? 'Ocultar títeres' : 'Mostrar títeres'}
        title={isVisible ? 'Ocultar títeres' : 'Mostrar títeres'}
        aria-expanded={isVisible}
        aria-controls="puppet-stage"
        onClick={togglePuppets}
      >
        <svg
          aria-hidden="true"
          className={`puppet-stage-chevron ${isVisible ? 'is-open' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
