import HomeTabs from "@/components/home/HomeTabs";
import { cookies } from "next/headers";
import React from "react";

const Home = async () => {
  const userId = await cookies().get("user_id")?.value;
  console.log("userId: ", userId);
  return (
    <div>
      <HomeTabs userId={userId} />
    </div>
  );
};

export default Home;
