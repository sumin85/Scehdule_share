import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, kakaoProvider } from './sign/firebase';

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(username === 'admin' && password === 'password') {
            navigate('/mypage');
        } else{
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log('Google 로그인 성공:', user);
            alert(`환영합니다, ${user.displayName}님!`);
            navigate('/mypage');
        } catch (error) {
            console.error('Google 로그인 실패:', error);
            alert('Google 로그인에 실패했습니다.');
        }
    };

    const handleNaverLogin = async () => {
        const state = Math.random().toString(36).substring(2, 15) +
                     Math.random().toString(36).substring(2, 15);
        window.localStorage.setItem('naverState', state);

        const params = [
            'response_type=code',
            `client_id=${process.env.REACT_APP_NAVER_CLIENT_ID}`,
            `redirect_uri=${window.location.origin}/callback/naver`,
            `state=${state}`
        ].join('&');
        
        window.location.href = `https://nid.naver.com/oauth2.0/authorize?${params}`;
    };

    const handleKakaoLogin = async () => {
        try {
            const result = await signInWithPopup(auth, kakaoProvider);
            const user = result.user;
            console.log('카카오 로그인 성공:', user);
            alert(`환영합니다, ${user.displayName || user.email}님!`);
            navigate('/mypage');
        } catch (error) {
            console.error('카카오 로그인 실패:', error);
            alert('카카오 로그인에 실패했습니다.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-page">
                <h2 className="login-title">로그인</h2>
                <div className="divider" />
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            placeholder="아이디를 입력해주세요"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="비밀번호를 입력해주세요"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="submit-button">로그인</button>
                </form>
                <div className="sub-links">
                    <Link to="/register">회원가입</Link>
                    <span>|</span>
                    <Link to="/find-id-password">아이디/비밀번호 찾기</Link>
                </div>
                <div className="divider" />
                <div className="social-title">소셜 로그인</div>
                <div className="social-buttons">
                    <button className="social-button kakao" onClick={handleKakaoLogin} title="카카오로 로그인" aria-label="카카오로 로그인">카카오</button> 
                    <button className="social-button naver" onClick={handleNaverLogin} title="네이버로 로그인" aria-label="네이버로 로그인">네이버</button>
                    <button className="social-button google" onClick={handleGoogleLogin} title="구글로 로그인" aria-label="구글로 로그인">구글</button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;