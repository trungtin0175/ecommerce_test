import Header from "./header";
import { Outlet } from "react-router-dom";

export default function mainLayout() {
  return (
    <>
      <div className="min-h-screen w-screen flex flex-col">
        <Header />
        <Outlet />
      </div>
    </>
  );
}
