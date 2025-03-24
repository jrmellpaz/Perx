import { redirect } from 'next/navigation';

export default async function ViewCoupon({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const id = (await searchParams).id;

  if (!id) {
    redirect('/not-found');
  }

  return (
    <section>
      <Ticket
        title="Sample Ticket"
        description="This is a sample ticket description."
        price="$10.00"
        image="https://via.placeholder.com/150"
      />
    </section>
  );
}

function Ticket({
  title,
  description,
  price,
  image,
}: {
  title: string;
  description: string;
  price: string;
  image?: string;
}) {
  return (
    <div className="relative flex w-[90%] max-w-[800px] flex-col rounded-lg border bg-white shadow-md">
      {/* Upper Half */}
      <div className="flex flex-col">
        {image && (
          <div className="h-40 w-full overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {/* Broken Line Divider */}
      <div className="relative flex items-center">
        <div className="w-full border-t border-dashed border-gray-300"></div>
        {/* Left Circular Div */}
        <div className="border-muted-foreground/30 inset-right absolute -left-3 size-6 rounded-full bg-white"></div>
        {/* Right Circular Div */}
        <div className="border-muted-foreground/30 inset-left absolute -right-3 size-6 rounded-full bg-white"></div>
      </div>

      {/* Lower Half */}
      <div className="flex items-center justify-between p-4">
        <span className="text-perx-crimson text-xl font-semibold">{price}</span>
        <button className="bg-perx-blue hover:bg-perx-blue/90 rounded-full px-4 py-2 text-sm font-medium text-white">
          Redeem
        </button>
      </div>
    </div>
  );
}
