'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDevice } from './DeviceContext';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const Gallery = ({ style }: GalleryProps) => {
    const galleryRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const scrollState = useRef({
        currentX: 0,
        targetX: 0,
        speed: 0.1
    });
    const parallaxState = useRef(Array(NUM_COLUMNS).fill(0).map(() => ({ targetY: 0, currentY: 0 })));
    const isActive = useRef(false);
    const touchState = useRef({
        startX: 0,
        startY: 0,
        currentX: 0,
        isDragging: false
    });
    
    // Utilizza il context per rilevare il dispositivo
    const { isMobile: contextIsMobile, isMobileDetected } = useDevice();
    const isMobileDevice = contextIsMobile || isMobileDetected;
    
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

    useGSAP(() => {
        // Su mobile, non attivare l'animazione GSAP
        if (isMobileDevice) {
            console.log('[Gallery] Modalità mobile: animazione GSAP disabilitata');
            return;
        }

        const wrappers = gsap.utils.toArray<HTMLElement>(`.${styles.imageWrapper}`);
        wrappers.forEach((wrapper) => {
            gsap.from(wrapper, {
                scrollTrigger: {
                    trigger: wrapper,
                    start: "left 90%",
                    end: "right 10%",
                    horizontal: true,
                    scrub: 1,
                },
                scale: 0.8,
                opacity: 0,
                filter: 'blur(10px)',
                ease: 'power3.out'
            });
        });

        gsap.from(quoteRef.current, {
            scrollTrigger: {
                trigger: quoteRef.current,
                start: 'top 90%',
                end: 'bottom 20%',
                scrub: 1,
            },
            scale: 0.8,
            opacity: 0,
            filter: 'blur(10px)',
            ease: 'power3.out'
        });
    }, { dependencies: [isMobileDevice] });

    const runAnimation = useCallback(() => {
        // Su mobile, non eseguire l'animazione
        if (isMobileDevice) {
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        const columns = Array.from(container.children) as HTMLElement[];
        columns.forEach((column, index) => {
            const state = parallaxState.current[index];
            if (state) {
                state.currentY += (state.targetY - state.currentY) * 0.1;
                gsap.set(column, { y: state.currentY });
            }
        });

        const gallery = galleryRef.current;
        if (gallery) {
            scrollState.current.currentX += (scrollState.current.targetX - scrollState.current.currentX) * 0.1;
            gsap.set(gallery, { x: scrollState.current.currentX });
        }

        requestAnimationFrame(runAnimation);
    }, [isMobileDevice]);

    useEffect(() => {
        // Su mobile, non attivare nulla - scroll completamente normale
        if (isMobileDevice) {
            console.log('[Gallery] Modalità mobile: tutte le animazioni disabilitate, scroll normale');
            return;
        }

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

            if (e.deltaY < 0 && atEnd) return;
            if (e.deltaY > 0 && atStart) return;

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

        // Touch event handlers for mobile
        const handleTouchStart = (e: TouchEvent) => {
            if (!isActive.current) return;
            
            const touch = e.touches[0];
            touchState.current.startX = touch.clientX;
            touchState.current.startY = touch.clientY;
            touchState.current.currentX = touch.clientX;
            touchState.current.isDragging = false;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isActive.current || !touchState.current.isDragging) return;

            const gallery = galleryRef.current;
            const container = containerRef.current;
            if (!gallery || !container) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchState.current.currentX;
            touchState.current.currentX = touch.clientX;

            const scrollWidth = container.scrollWidth;
            const clientWidth = gallery.clientWidth;
            const minScroll = -(scrollWidth - clientWidth);
            const maxScroll = 0;

            const tolerance = 2;
            const atStart = scrollState.current.currentX >= maxScroll - tolerance;
            const atEnd = scrollState.current.currentX <= minScroll + tolerance;

            if (deltaX > 0 && atStart) return;
            if (deltaX < 0 && atEnd) return;

            e.preventDefault();

            const newTargetX = scrollState.current.targetX - deltaX * 2;
            scrollState.current.targetX = Math.max(minScroll, Math.min(maxScroll, newTargetX));
            
            const columnElements = containerRef.current?.children;
            if (!columnElements) return;

            for (let i = 0; i < columnElements.length; i++) {
                const state = parallaxState.current[i];
                if(state){
                    const speed = (i % NUM_COLUMNS) * 0.1 - 0.2;
                    state.targetY += deltaX * speed * 0.5;
                }
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!isActive.current) return;
            
            const touch = e.changedTouches[0];
            const deltaX = Math.abs(touch.clientX - touchState.current.startX);
            const deltaY = Math.abs(touch.clientY - touchState.current.startY);
            
            // If horizontal movement is greater than vertical, it's a swipe
            if (deltaX > deltaY && deltaX > 10) {
                touchState.current.isDragging = true;
            }
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isActive.current = entry.isIntersecting;
            },
            { threshold: 0.5 }
        );
        
        const currentGallery = galleryRef.current;
        if (currentGallery) {
            observer.observe(currentGallery);
        }

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        const animFrame = requestAnimationFrame(runAnimation);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            if (currentGallery) {
                observer.unobserve(currentGallery);
            }
            cancelAnimationFrame(animFrame);
        };
    }, [runAnimation, isMobileDevice]);

    return (
        <section 
            ref={galleryRef} 
            className={`${styles.gallery} ${isMobileDevice ? styles.mobileGallery : ''}`} 
            style={style}
        >
            <div ref={containerRef} className={styles.scrollingContainer}>
                {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className={styles.column}>
                        {column.map((image, imageIndex) => (
                            <div key={imageIndex} className={styles.imageWrapper}>
                                <Image
                                    src={image.src}
                                    alt={image.prompt}
                                    width={400}
                                    height={image.height}
                                    className={styles.image}
                                    priority={columnIndex < NUM_COLUMNS}
                                />
                                <div className={styles.promptBox}>
                                    <p>{image.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div ref={quoteRef} className={styles.quote}>
                <h2>Ogni immagine è il frutto di una scelta.<br/>
                Ogni scelta è il riflesso della tua immaginazione.</h2>
            </div>
        </section>
    );
};

export default Gallery; 