"use client";

import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, useMotionValue } from "framer-motion";
// import VideoSlider from "../components/VideoSlider";
import dynamic from "next/dynamic";
import { useState } from "react";
import SlideIn from "@/components/SlideInLR";

// Dynamically import VideoSlider to disable SSR
const VideoSlider = dynamic(() => import("../components/VideoSlider"), {
  ssr: false,
  loading: () => <div className="w-full h-[56.25vw] max-h-[100vh] bg-gray-200 animate-pulse" />,
});

export default function Home() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const translateY = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsVisible(false);
      translateY.set(-100);
    } else {
      setIsVisible(true);
      translateY.set(0);
    }
  });

  return (
    <>
      <motion.header
        style={{ y: translateY }}
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 bg-green-500/50 bg-opacity-25 backdrop-blur-sm h-14 md:h-16 flex items-center justify-between text-white text-lg md:text-xl z-50 font-bold px-2 sm:px-4 "
      >
        <div className="hidden md:flex gap-2 sm:gap-4">
          <Image
            src="/logo_dinsos_diy.png"
            alt="Home icon"
            width={40} // Lebar asli gambar
            height={24} // Tinggi asli gambar
            className=" w-auto object-fit"
            priority={true} // Opsional: untuk gambar di atas fold
          />
          {/* <Image
            src="/user.svg"
            alt="User icon"
            width={24}
            height={24}
            className=""
          /> */}
          <Image
            src="/logo_lambada.png"
            alt="Menu icon"
            width={50} // Lebar asli gambar
            height={24} // Tinggi asli gambar
            className=" w-auto object-fit"
            priority={true} // Opsional: untuk gambar di atas fold
         />
        </div>
        <div className="md:flex-1 text-center text-sm sm:text-lg md:text-xl">
          BALAI PELAYANAN SOSIAL TRESNA WERDHA
        </div>
      </motion.header>
      {/* VideoSlider with dynamic padding-top */}
      <div className={isVisible ? "pt-16 h-[100vh]" : "pt-10 h-[100vh]"}>
        <VideoSlider
          videoUrls={[
            '/videos/video1.webm',
            '/videos/video2.webm',
            '/videos/video3.webm',
          ]}
        />
      </div>
      <SlideIn>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 py-8 px-4 max-w-6xl mx-auto">
          {/* Image on top for mobile, left for desktop */}
          <div className="flex-shrink-0">
            <Image
              src="/bu_tuty.png"
              alt="Description image"
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          {/* Text below for mobile, right for desktop */}
          <div className="flex flex-col gap-2  border-4 border-green-500 rounded-3xl p-5 bg-gray-500/50 bg-opacity-25 backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Kepala Balai Pelayanan Sosial Tresna Werdha</h2>
            <h2 className="text-2xl md:text-3xl font-bold text-white">( BPSTW )</h2>
            <h3 className="text-3xl md:text-4xl font-semibold text-white">Tuty Amalia, SH., M.Si</h3>
            <p className="text-base md:text-lg text-gray-200">
              Balai Pelayanan Sosial Tresna Werdha Dinas Sosial Daerah Istimewa Yogyakarta adalah salah satu Unit Pelaksana Teknis (UPT) yang ada di bawah Dinas Sosial DIY kami diberi tugas sebagai unit yang melakukan pelayanan sosial terhadap lansia yang ada di Daerah Istimewa Yogyakarta.
            </p>
          </div>
        </div>
      </SlideIn>

      <footer className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 ">
          <div className="flex flex-col gap-1 flex-2  border-4 border-green-500 rounded-3xl p-5 bg-gray-500/50 bg-opacity-25 backdrop-blur-sm">
            <h3 className="font-semibold text-white text-base md:text-lg">Balai Pelayanan Tresna Werdha Abiyoso</h3>
            <h4 className="font-semibold text-white text-sm md:text-base">Jl. Kasongan No.223, Kajen, Bangunjiwo, Kec. Kasihan, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55184</h4>
          </div>
          <div className="flex flex-col gap-1 flex-2  border-4 border-green-500 rounded-3xl p-5 bg-gray-500/50 bg-opacity-25 backdrop-blur-sm">
            <h3 className="font-semibold text-white text-base md:text-lg">Balai Pelayanan Tresna Werdha Budi Luhur</h3>
            <h4 className="font-semibold text-white text-sm md:text-base">JL. Kaliurang, Km. 17, 5, Pakem, Yogyakarta, Area Sawah, Pakembinangun, Pakem, Sleman Regency, Special Region of Yogyakarta 55582</h4>
          </div>
          <div className="flex flex-col gap-1 flex-1  border-4 border-green-500 rounded-3xl p-5 bg-gray-500/50 bg-opacity-25 backdrop-blur-sm">
            <h3 className="font-semibold text-white text-base md:text-lg">Nomor Telepon</h3>
            <h4 className="font-semibold text-white text-sm md:text-base">(0274) 895402</h4>
          </div>
        </div>
      </footer>

    </>
  );
}