import HomeTabs from "@/components/home/HomeTabs";
import { cookies } from "next/headers";
import React from "react";

const Home = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  return <HomeTabs userId={userId} />;
};

export default Home;
