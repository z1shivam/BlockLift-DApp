import { MdStart } from "react-icons/md";
import { Button } from "../ui/button";
import { henny_penny } from "./Header";

export default function Hero() {
  return (
    <section className="h-80 w-full bg-emerald-900">
      <div
        className="flex h-full items-center justify-between"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 270 270' width='40' height='40' transform='rotate(45)'%3E%3Cpath d='M128.6 149.4c-3.1 2-2.5 2.7-22.2 29.7-10 13.7-28.2 37.2-33.8 50.4-.7 1.7-.9 3.5-.6 5.4 1.8 7.4 13.6 7.1 15.2-.3 7.6-15.1 32.9-46 48.9-69 7.8 8.3 46.1 64.7 55.9 77.7 1.8 2.4 4.9 3.5 7.9 3.2 6.8-.6 10.1-7.6 6.5-12.5-47.6-64-61-95.5-77.8-84.6zM208.5 173c-14.3-20.6-60.7-90.8-85.4-88.2-3.5.4-6.8 2.4-8.7 5.4-5.8 9.3-4.6 10.3-43.6 75.6-1.9 3.3-4.4 7.3-2.2 11.1 1.9 3.3 6.7 4.5 10 2.7 1.8-1 3.1-2.1 3.8-4.1 3.6-6.3 15.4-22.5 44.4-74.4 21.1 12 58.3 68 67.5 81.1 1.4 2 7.1 3.3 7.8 3.2 6.2-.4 10.4-6.7 6.4-12.4zm-128.4 5.7c.4-.3.7-.6 1-1-.4.5-.8.8-1 1zM75.1 111c1.9-3.6 40-55.9 53.6-70.6 10.8 8.4 31.1 33.4 49.1 49.6 1.7 1.5 3.7 2.4 5.9 2.5 8.1.3 11.8-8.8 6.9-13.2-15.4-13.8-31-32.5-45-45.7-4.5-4.2-9.6-8.8-15.9-9.9-3.5-.6-7.7.6-11.1 4.2C105.2 42 92.4 60.1 77.3 81.2c-13.9 19.5-17.7 24.3-17.4 29.4.3 4 4.2 6.6 8.2 6.3 3.4-.3 6.4-2.7 7-5.9z' fill='%234A6543'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <div
            className={`${henny_penny.className} text-center text-5xl font-bold text-white`}
          >
            Fund Your Dreams on the Blockchain
          </div>
          <div className="flex w-full justify-center">
            <Button
              className="flex h-12 cursor-pointer items-center gap-2 rounded-full border-2 border-emerald-600 bg-emerald-800 px-6 text-white shadow-md hover:bg-emerald-900"
              size={"lg"}
            >
              Start Your Campaign
              <MdStart />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
