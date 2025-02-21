import { EllipsisVertical, EllipsisVerticalIcon, Image } from 'lucide-react';

const TopCouponsMonth = () => {
  return (
    <div className="bg-blue-300 p-4 rounded-md">
      <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">Top coupons this month</h1>
      </div>
      <div className="flex flex-col gap-1 mt 4">
        <div className="bg-amber-200 rounded-md p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 1<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-amber-200 rounded-md p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 2<div className="text-xs">Lorem ipsum</div></h1>
            <div className="ml-auto">
            <EllipsisVerticalIcon size={20} />
            </div>
          </div>
        </div>
        <div className="bg-amber-200 rounded-md p-4">
          <div className="flex items-center">
            <Image size={50}/>
            <h1>Coupon 3<div className="text-xs">Lorem ipsum</div></h1>
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