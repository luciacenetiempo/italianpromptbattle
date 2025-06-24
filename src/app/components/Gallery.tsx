'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';

interface ImageType {
    src: string;
    prompt: string;
    height: number;
}

interface GalleryProps {
    style?: React.CSSProperties;
}

const originalImages: ImageType[] = [
    { src: '/assets/gallery/gallery_1.png', prompt: 'DREAM CIRCUIT', height: 600 },
    { src: '/assets/gallery/gallery_2.png', prompt: 'NOVA PULSE', height: 800 },
    { src: '/assets/gallery/gallery_3.png', prompt: 'FRACTAL MIRAGE', height: 500 },
    { src: '/assets/gallery/gallery_4.png', prompt: 'SONIC HORIZON', height: 700 },
    { src: '/assets/gallery/gallery_5.png', prompt: 'RADIANT DUSK', height: 600 },
    { src: '/assets/gallery/gallery_6.png', prompt: 'LUNAR MESH', height: 800 },
    { src: '/assets/gallery/gallery_7.png', prompt: 'VORTEX BLOOM', height: 500 },
    { src: '/assets/gallery/gallery_8.png', prompt: 'PIXEL DRIFT', height: 700 },
    { src: '/assets/gallery/gallery_9.png', prompt: 'SHADOW STATIC', height: 600 },
    { src: '/assets/gallery/gallery_10.png', prompt: 'CRIMSON PHASE', height: 800 },
    { src: '/assets/gallery/gallery_11.png', prompt: 'HEAT CORE', height: 500 },
    { src: '/assets/gallery/gallery_12.png', prompt: 'GRAVITY SYNC', height: 700 },
    { src: '/assets/gallery/gallery_13.png', prompt: 'ECHO DISCS', height: 600 },
    { src: '/assets/gallery/gallery_14.png', prompt: 'ETHER GLOW', height: 800 },
    { src: '/assets/gallery/gallery_15.png', prompt: 'QUANTUM LEAP', height: 500 },
    { src: '/assets/gallery/gallery_16.png', prompt: 'VOID WHISPERS', height: 700 },
];

const NUM_COLUMNS = 5;

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const Gallery = ({ style }: GalleryProps) => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollState = useRef({ targetX: 0, currentX: 0, speed: 0.08 });
    const parallaxState = useRef(Array(NUM_COLUMNS).fill(0).map(() => ({ targetY: 0, currentY: 0 })));
    const isActive = useRef(false);
    
    const columns = useMemo(() => {
        const newColumns: ImageType[][] = Array(NUM_COLUMNS).fill(null).map(() => []);
        const columnHeights = Array(NUM_COLUMNS).fill(0);

        originalImages.forEach(image => {
            const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));
            newColumns[minHeightIndex].push(image);
            columnHeights[minHeightIndex] += image.height;
        });
        
        return newColumns;
    }, []);

    const runAnimation = useCallback(() => {
        if (!containerRef.current || !galleryRef.current) return;
        
        scrollState.current.currentX = lerp(scrollState.current.currentX, scrollState.current.targetX, scrollState.current.speed);
        containerRef.current.style.transform = `translateX(${scrollState.current.currentX}px)`;

        const columnElements = containerRef.current.children;
        for (let i = 0; i < columnElements.length; i++) {
            const state = parallaxState.current[i];
            if(state){
                state.currentY = lerp(state.currentY, state.targetY, 0.05);
                (columnElements[i] as HTMLDivElement).style.transform = `translateY(${state.currentY}px)`;
            }
        }

        requestAnimationFrame(runAnimation);
    }, []);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!isActive.current) return;

            const gallery = galleryRef.current;
            const container = containerRef.current;
            if (!gallery || !container) return;

            const scrollWidth = container.scrollWidth;
            const clientWidth = gallery.clientWidth;
            const minScroll = -(scrollWidth - clientWidth);
            const maxScroll = 0;

            const tolerance = 2;
            const atStart = scrollState.current.currentX >= maxScroll - tolerance;
            const atEnd = scrollState.current.currentX <= minScroll + tolerance;

            if (e.deltaY < 0 && atStart) return;
            if (e.deltaY > 0 && atEnd) return;

            e.preventDefault();

            const newTargetX = scrollState.current.targetX - e.deltaY * 1.2;
            scrollState.current.targetX = Math.max(minScroll, Math.min(maxScroll, newTargetX));
            
            const columnElements = containerRef.current?.children;
            if (!columnElements) return;

            for (let i = 0; i < columnElements.length; i++) {
                const state = parallaxState.current[i];
                if(state){
                    const speed = (i % NUM_COLUMNS) * 0.1 - 0.2;
                    state.targetY += e.deltaY * speed;
                }
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isActive.current = entry.isIntersecting;
            },
            { threshold: 1.0 }
        );
        
        const currentGallery = galleryRef.current;
        if (currentGallery) {
            observer.observe(currentGallery);
        }

        window.addEventListener('wheel', handleWheel, { passive: false });
        const animFrame = requestAnimationFrame(runAnimation);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            if (currentGallery) {
                observer.unobserve(currentGallery);
            }
            cancelAnimationFrame(animFrame);
        };
    }, [runAnimation]);

    return (
        <section className={styles.gallery} ref={galleryRef} style={style}>
            <div className={styles.scrollingContainer} ref={containerRef} data-gallery-container>
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className={styles.column}>
                        {column.map((image, imgIndex) => (
                            <div key={`${colIndex}-${imgIndex}`} className={styles.imageWrapper}>
                                <Image
                                    src={image.src}
                                    alt={image.prompt}
                                    width={400}
                                    height={image.height}
                                    className={styles.image}
                                    priority={colIndex < NUM_COLUMNS}
                                />
                                <div className={styles.promptBox}>
                                    <p>{image.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.quote}>
                <h2>Ogni immagine è il frutto di una scelta.<br/>
                Ogni scelta è il riflesso della tua immaginazione.</h2>
            </div>
        </section>
    );
};

export default Gallery; 