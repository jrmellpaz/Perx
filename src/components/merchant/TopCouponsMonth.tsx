import { EllipsisVertical, EllipsisVerticalIcon, Image } from 'lucide-react';

const TopCouponsMonth = () => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
      <div className="w-full text-xl font-mono-semibold my-2 border-b-4 border-b-perx-crimson">Top coupons this month</div>
      </div>
      <div className="flex flex-col gap-1 mt 4">
        <div className="bg-white border-b-2 border-b-perx-crimson p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 1<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border-b-2 border-b-perx-crimson p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 2<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border-b-2 border-b-perx-crimson p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 3<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border-b-2 border-b-perx-crimson p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 4<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white border-b-2 border-b-perx-crimson p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 5<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopCouponsMonth