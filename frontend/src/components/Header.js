import React, {useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = false;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return(
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="header-container">
                <button className="hamburger" aria-label="Toggle menu" onClick={onToggleSidebar}>
                  <span />
                  <span />
                  <span />
                </button>
                <Link to="/" className="logo">
                    <h1 className="logo">Schedule Share</h1>
                </Link>
                <nav className="header-nav">
                    <Link to={isLoggedIn ? "/mypage" : "/login"}  className="icon-button-mypage" title={isLoggedIn ? "마이페이지" : "로그인"}>👤</Link>
                </nav>
            </div>    
        </header>
  );
};

export default Header;