import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from './sign/firebase';
import axios from 'axios';

const NaverCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleNaverCallback = async () => {
            try {
                // URL에서 파라미터 추출
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');

                // 에러 체크
                if (error) {
                    throw new Error(`네이버 로그인 에러: ${error}`);
                }

                if (!code) {
                    throw new Error('인증 코드가 없습니다.');
                }

                // State 검증
                const savedState = localStorage.getItem('naverState');
                if (state !== savedState) {
                    throw new Error('State 값이 일치하지 않습니다.');
                }

                // localStorage에서 state 제거
                localStorage.removeItem('naverState');

                // Node.js 백엔드 API 호출
                const response = await axios.post('/api/naver-auth/exchange-token', {
                    code: code
                });

                // 네이버 코드를 Firebase 토큰으로 교환
                const { firebaseToken } = response.data.data;

                // Firebase 커스텀 토큰으로 로그인
                await signInWithCustomToken(auth, firebaseToken);

                // 로그인 성공 - 마이페이지로 이동
                alert('네이버 로그인 성공!');
                navigate('/mypage');

            } catch (error) {
                console.error('네이버 콜백 처리 실패:', error);
                setError(error.message);
                
                // 3초 후 로그인 페이지로 이동
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        handleNaverCallback();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column'
            }}>
                <h2>네이버 로그인 처리 중...</h2>
                <p>잠시만 기다려주세요.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                flexDirection: 'column'
            }}>
                <h2>로그인 실패</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <p>3초 후 로그인 페이지로 이동합니다...</p>
            </div>
        );
    }

    return null;
};

export default NaverCallback;
