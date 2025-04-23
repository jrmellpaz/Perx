import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="font-sans font-bold tracking-tighter"> perx </h1>
      <p className="font-mono">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        ipsa cum nostrum harum consectetur cupiditate. Cupiditate suscipit atque
        minus. Minus adipisci, expedita aliquid ad doloribus tempore optio nulla
        reprehenderit saepe! Ab sequi nulla excepturi consectetur minima ipsum
        eius officia minus veritatis, deserunt aspernatur nisi quisquam laborum
        reprehenderit numquam, qui earum, tempora vel illo aliquid perferendis
        repudiandae commodi fugit nam. Amet?
      </p>
      <Link href="/merchant/register">Go to merchant</Link>
      <Link href="/explore">Go to consumer</Link>
    </div>
  );
}
