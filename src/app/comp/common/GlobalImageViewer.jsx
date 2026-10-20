'use client';

import { useEffect, useRef, useState } from 'react';

function getImageFromTarget(target) {
  if (!(target instanceof Element)) return null;

  const explicitViewer = target.closest('[data-image-zoom]');
  if (explicitViewer) {
    return explicitViewer instanceof HTMLImageElement
      ? explicitViewer
      : explicitViewer.querySelector('img');
  }

  if (!(target instanceof HTMLImageElement)) return null;
  if (target.parentElement?.closest('button, a, [role="button"], [data-image-zoom-ignore], [role="dialog"]')) {
    return null;
  }

  return target;
}

export function GlobalImageViewer() {
  const [image, setImage] = useState(null);
  const closeButtonRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEffect(() => {
    const openImage = (imageElement, event, focusTarget) => {
      if (!imageElement?.src) return;

      event.preventDefault();
      event.stopPropagation();
      returnFocusRef.current = focusTarget;
      setImage({
        src: imageElement.currentSrc || imageElement.src,
        alt: imageElement.alt || 'Imagen ampliada',
      });
    };

    const enhanceImages = () => {
      document.querySelectorAll('img').forEach((element) => {
        if (!(element instanceof HTMLImageElement) || !getImageFromTarget(element)) return;
        if (element.closest('button, a, [role="button"]')) return;

        if (element.dataset.globalImageZoom !== 'true') {
          element.dataset.globalImageZoom = 'true';
          element.tabIndex = 0;
          element.setAttribute('role', 'button');
          element.setAttribute(
            'aria-label',
            `Ampliar imagen: ${element.alt || 'imagen'}`,
          );
        }
        if (element.dataset.globalImageZoomBound === 'true') return;

        element.dataset.globalImageZoomBound = 'true';
        element.addEventListener('click', (event) => openImage(element, event, element));
        element.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') openImage(element, event, element);
        });
      });

      document.querySelectorAll('[data-image-zoom]').forEach((viewer) => {
        if (viewer.dataset.globalImageZoomHandler === 'true') return;
        const imageElement = viewer instanceof HTMLImageElement
          ? viewer
          : viewer.querySelector('img');
        if (!imageElement) return;

        viewer.dataset.globalImageZoomHandler = 'true';
        viewer.addEventListener('click', (event) => openImage(imageElement, event, viewer));
      });
    };

    const observer = new MutationObserver(enhanceImages);
    observer.observe(document.body, { childList: true, subtree: true });
    enhanceImages();
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!image) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setImage(null);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [image]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      onClick={() => setImage(null)}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 p-4 sm:p-8"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={() => setImage(null)}
        aria-label="Cerrar imagen ampliada"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/70 bg-black/70 text-3xl font-bold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ×
      </button>
      <img
        data-image-zoom-ignore
        src={image.src}
        alt={image.alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full rounded object-contain"
      />
    </div>
  );
}
