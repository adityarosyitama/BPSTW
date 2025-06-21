"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, useMotionValue } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SlideIn from "@/components/SlideInLR";
import SplashScreen from "@/components/SplahScreen";

const VideoSlider = dynamic(() => import("../components/VideoSlider"), {
  ssr: false,
  loading: () => <div className="h-[56.25vw] max-h-[100vh] w-full bg-gray-200 animate-pulse" />,
});

export default function Home() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  // const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const translateY = useMotionValue(0);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // const videoUrls = isMobile
  //   ? ["/videos/video1.webm", "/videos/video2.webm", "/videos/video3.webm"]
  //   : ["/videos/video1.mp4", "/videos/video2.mp4", "/videos/video3.mp4"];

  const videoUrls = ["/videos/video1.mp4", "/videos/video2.mp4", "/videos/video3.mp4"];

  // const toggleMute = () => setIsMuted(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const threshold = 50;
    setIsVisible(latest <= threshold);
    translateY.set(latest > threshold ? -100 : 0);
  });

  if (showSplash) {
    return <SplashScreen
      logoSrc="/logo_dinsos_diy.png" // Provide the path to your logo
      onFadeComplete={() => setShowSplash(false)}
    />;
  }
  return (
    <>
      <motion.header
        style={{ y: translateY }}
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-green-500/50 px-2 text-lg text-white backdrop-blur-sm sm:px-4 md:h-16 md:text-xl"
      >
        <div className="hidden gap-2 md:flex sm:gap-4">
          <Image
            src="/logo_dinsos_diy.png"
            alt="Dinsos DIY Logo"
            width={40}
            height={24}
            className="object-contain"
            priority
          />
          <Image
            src="/logo_lambada.png"
            alt="Lambada Logo"
            width={50}
            height={24}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="flex-1 text-center text-sm sm:text-lg md:text-xl">
          BALAI PELAYANAN SOSIAL TRESNA WERDHA
        </h1>
        {/*Mute/Unmute Button (Mobile Only)*/}
        {/* {isMuted && isMobile && (
          <Image
            onClick={toggleMute}
            src="/mute.svg"
            alt="mute logo"
            width={24}
            height={24}
            className="absolute bottom-4 right-4 bg-white rounded-full p-1 focus:outline-none hover:bg-opacity-75 transition-all"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
          </Image>
        )} */}
      </motion.header>

      <div className={`h-[100vh] ${isVisible ? "pt-16" : "pt-10"}`}>
        <VideoSlider videoUrls={videoUrls} isMobile={isMobile} />
      </div>

      <SlideIn>
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 md:flex-row md:gap-8"
        >
          <div className="flex-shrink-0">
            <Image
              src="/bu_tuty.png"
              alt="Kepala BPSTW"
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-col gap-2 rounded-3xl border-4 border-green-500 bg-gray-500/50 p-5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white md:text-3xl">
              Kepala Balai Pelayanan Sosial Tresna Werdha
            </h3>
            <h1 className="text-2xl font-bold text-white md:text-3xl">(BPSTW)</h1>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Tuty Amalia, SH., M.Si</h2>
            <p className="text-base text-gray-200 md:text-lg">
              Balai Pelayanan Sosial Tresna Werdha Dinas Sosial Daerah Istimewa Yogyakarta adalah salah satu Unit
              Pelaksana Teknis (UPT) yang ada di bawah Dinas Sosial DIY kami diberi tugas sebagai unit yang melakukan
              pelayanan sosial terhadap lansia yang ada di Daerah Istimewa Yogyakarta.
            </p>
          </div>
        </div>
      </SlideIn>

      <footer className="px-4 py-8" >
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row">
          <div className="flex flex-2 flex-col gap-1 rounded-3xl border-4 border-green-500 bg-gray-500/50 p-5 backdrop-blur-sm">
            <h3 className="text-base font-semibold text-white md:text-lg">Balai Pelayanan Tresna Werdha Abiyoso</h3>
            <a
              href="https://maps.app.goo.gl/xR4oUJMiMLTKwACVA"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 gap-2 inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 md:text-base"
            >
              <div className="rounded-full bg-white p-1 inline-block">
                <Image
                  src="/logo_google_maps.png"
                  alt="Lambada Logo"
                  width={50}
                  height={50}
                  className="object-contain w-fit"
                  priority
                />
              </div>
              <h4 className="text-sm font-semibold text-white md:text-base">
                Jl. Kaliurang, Km. 17, 5, Pakem, Yogyakarta, Area Sawah, Pakembinangun, Pakem, Sleman Regency, Special
                Region of Yogyakarta 55582
              </h4>
            </a>
            <h4 className="text-base font-semibold text-white md:text-lg">Nomor Telepon (0274) 895402</h4>
            <a
              href="https://wa.me/6282326067320"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 gap-2 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 md:text-base"
            >
              <div className="rounded-full bg-white inline-block">
                <Image
                  src="/logo_whatsapp.png"
                  alt="Lambada Logo"
                  width={30}
                  height={30}
                  className="object-contain  w-fit"
                  priority
                />
              </div>
              <h4>WhatsApp: 082326067320</h4>
            </a>
          </div>
          <div className="flex flex-2 flex-col gap-1 rounded-3xl border-4 border-green-500 bg-gray-500/50 p-5 backdrop-blur-sm">
            <h3 className="text-base font-semibold text-white md:text-lg">Balai Pelayanan Tresna Werdha Budi Luhur</h3>
            <a
              href="https://maps.app.goo.gl/MJF4Qg63sfE4A7Qw7"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 gap-2 inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 md:text-base"
            >
              <div className="rounded-full bg-white p-1 inline-block">
                <Image
                  src="/logo_google_maps.png"
                  alt="Lambada Logo"
                  width={50}
                  height={50}
                  className="object-contain  w-fit"
                  priority
                />
              </div>
              <h4 className="text-sm font-semibold text-white md:text-base">
                Jl. Kasongan No.223, Kajen, Bangunjiwo, Kec. Kasihan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55184
              </h4>
            </a>
            <h4 className="text-base font-semibold text-white md:text-lg">Nomor Telepon (0274) 895402</h4>
            <a
              href="https://wa.me/6282221278569"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 gap-2 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 md:text-base"
            >
              <div className="rounded-full bg-white inline-block">
                <Image
                  src="/logo_whatsapp.png"
                  alt="Lambada Logo"
                  width={30}
                  height={30}
                  className="object-contain  w-fit"
                  priority
                />
              </div>
              <h4>WhatsApp: 082221278569</h4>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}