import React,{useState, useEffect} from "react";
import Dashboard from "./Home/Dashboard";


function HomePage() {
    const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users`)
    .then(res => res.json())
    .then(data => setUsers(data));
  },[]);

  return(
    <div>
      <Dashboard />
    </div>
  )
}

export default HomePage;