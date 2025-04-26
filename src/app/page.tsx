import Link from 'next/link';
import LandingNavbar from '@/components/custom/LandingNavbar';
import Hero from '@/components/custom/Hero';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* <LandingNavbar /> */}
      <Hero />
    </div>

    // <div>
    //   <h1 className="font-sans font-bold tracking-tighter"> perx </h1>
    //   <div className="flex flex-col gap-4 lg:flex-row">
    //     {/* <img
    //       src="/logo.svg"
    //       alt="logo"
    //       className="absolute top-0 left-0 h-24 w-24 p-2"
    //     /> */}
    //     <div className="flex w-full flex-col lg:w-50">Main</div>
    //     <div className="flex w-full flex-col lg:w-100">About</div>
    //   </div>
    //   <p>
    //     Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
    //     ipsa cum nostrum harum consectetur cupiditate. Cupiditate suscipit atque
    //     minus. Minus adipisci, expedita aliquid ad doloribus tempore optio nulla
    //     reprehenderit saepe! Ab sequi nulla excepturi consectetur minima ipsum
    //     eius officia minus veritatis, deserunt aspernatur nisi quisquam laborum
    //     reprehenderit numquam, qui earum, tempora vel illo aliquid perferendis
    //     repudiandae commodi fugit nam. Amet?
    //   </p>
    //   {/* <div className="items-center"> */}
    //   <Link href="/merchant/register">Go to merchant</Link>
    //   <Link href="/login">Go to consumer</Link>
    //   {/* </div> */}
    // </div>
  );
}
