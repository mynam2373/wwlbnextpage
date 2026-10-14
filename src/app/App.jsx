'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TheaterLayout } from './comp/puppets/TheaterLayout';
import { HomeView } from './view/HomeView';
import { VesteriaMap } from './comp/map/VesteriaMap';

import { CharactersPage } from './pages/CharactersPage';
import { GamesPage } from './pages/GamesPage';
import { NovelView } from './view/NovelView';
import CorreoPage from './pages/correoPage';
import { BuzonFlotante } from './comp/common/Buzon';
import { useAlternateMode } from './providers/AlternateModeProvider';

const SECRET_WORD = 'elizabeth';

export default function App({
  initialTab = 'inicio',
  novelSettings,
  volumes = [],
  mailboxSubmissions = [],
  isMailboxAdmin = false,
  mailboxAdminConfigured = false,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const typedWord = useRef('');
  const pathname = usePathname();
  const router = useRouter();
  const {
    collectedShardIds,
    collectShard,
    collectAllShards,
    isUnlocked,
  } = useAlternateMode();

  useEffect(() => {
    if (activeTab !== 'inicio') {
      typedWord.current = '';
      return undefined;
    }

    const handleSecretWord = (event) => {
      const target = event.target;
      const isTextEntry = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );

      if (isTextEntry || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1 || !/[a-z]/i.test(event.key)) {
        typedWord.current = '';
        return;
      }

      typedWord.current = `${typedWord.current}${event.key.toLowerCase()}`.slice(-SECRET_WORD.length);

      if (typedWord.current === SECRET_WORD) {
        collectAllShards();
        typedWord.current = '';
      }
    };

    window.addEventListener('keydown', handleSecretWord);
    return () => {
      window.removeEventListener('keydown', handleSecretWord);
      typedWord.current = '';
    };
  }, [activeTab, collectAllShards]);

  const handleLocketClick = () => {
    if (!isUnlocked) return;

    if (pathname !== '/') {
      router.push('/');
      return;
    }

    if (activeTab !== 'inicio') {
      setActiveTab('inicio');
      return;
    }

    router.push('/alternate');
  };

  // Función para manejar cuando hacés doble clic o clic en la ficha flotante
  const handleNavigateToCharacter = (charId) => {
    setSelectedEntity(null); // Cerramos el emergente flotante
    setActiveTab('personajes'); // Cambiamos a la pestaña de personajes
    // Si querés, podés pasar el ID seleccionado a CharacterView vía props si querés enfocar a ese personaje
  };

  return (
    <TheaterLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      collectedShardIds={collectedShardIds}
      isUnlocked={isUnlocked}
      onLocketClick={handleLocketClick}
    >
      {/* 1. INICIO */}
      {activeTab === 'inicio' && (
        <div className="flex flex-col items-center justify-between min-h-[85vh] w-full px-4 py-2">
          
          {/* Cartel principal / Título */}
          <HomeView />

          {/* Un solo Mapa en el centro */}
          <div className="w-full flex justify-center my-2">
            <VesteriaMap 
              onSelectPoint={(point) => setSelectedEntity(point)} 
            />
          </div>

          {/* Ficha Flotante al seleccionar en Inicio */}
          {selectedEntity && (
            <div className="fixed bottom-6 right-6 bg-[#fdf6e3] border-3 border-[#3d291a] p-3 rounded-lg shadow-[4px_4px_0px_#3d291a] z-50 text-[#3d291a] max-w-xs">
              <div className="flex justify-between items-center gap-4">
                <span className="font-black text-xs uppercase">
                  {selectedEntity.name || selectedEntity.title}
                </span>
                <button 
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs font-bold px-1.5 py-0.5 hover:bg-[#e5be82] rounded border border-[#3d291a]"
                >
                  ✕
                </button>
              </div>
              
              {selectedEntity.role && (
                <p className="text-[10px] text-[#6b4f38] font-bold mt-1">
                  Rol: {selectedEntity.role}
                </p>
              )}

              {/* Botón para ir directo a la ficha en la sección de Personajes */}
              {selectedEntity.characterId && (
                <button
                  onClick={() => handleNavigateToCharacter(selectedEntity.characterId)}
                  className="mt-2 w-full text-[10px] font-black uppercase bg-[#3d291a] text-[#fdf6e3] py-1 px-2 rounded hover:bg-[#553c2a] transition-colors"
                >
                  Ver Ficha Completa →
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* 2. NOVELA */}
      {activeTab === 'novela' && (
        <div className="w-full px-4 py-6">
          <NovelView settings={novelSettings} volumes={volumes} />
        </div>
      )}

      {/* 3. PERSONAJES */}
      {activeTab === 'personajes' && (
        <div className="w-full px-4 py-6">
          <CharactersPage
            collectedShardIds={collectedShardIds}
            onCollectShard={collectShard}
          />
        </div>
      )}

      {/* 4. MINIJUEGOS */}
      {activeTab === 'minijuegos' && (
        <div className="w-full px-4 py-6">
          <GamesPage
            collectedShardIds={collectedShardIds}
            onCollectShard={collectShard}
          />
        </div>
      )}
      {activeTab === 'correo' && (
        <div className="w-full px-4 py-6">
          <CorreoPage
            submissions={mailboxSubmissions}
            isAdmin={isMailboxAdmin}
            adminConfigured={mailboxAdminConfigured}
          />
        </div>
      )}

      <BuzonFlotante />
    </TheaterLayout>
  );
}