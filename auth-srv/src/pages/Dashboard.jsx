import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  console.log(message);

  useEffect( () => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/dashboard");
        console.log("res", res);
        if (res) {
          setMessage(res.data);
        }
      } catch (error) {
        console.error("Access denied", err);
      }
    };

    fetchDashboard()
  }, []);

  return (
    
    <div className="">
      <h1 className="text-xl font-bold">{message ? (message) : "Not Authenticated" }</h1>
    </div>
  );
};
export default Dashboard;
