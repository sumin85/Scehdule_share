import React, { useState, useEffect} from "react"; //페이지 이동위한 React Router
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth'; //Firebase 인증 상태 감지, SignOut firebase 로그아웃 함수
import { auth } from './sign/firebase'; //Firebase 인증 객체

const Mypage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    username: currentUser.displayName || '이름 없음',
                    email: currentUser.email,
                    photoURL: currentUser.photoURL,
                    uid: currentUser.uid
                });
            } else {
                // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('로그아웃되었습니다.');
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            alert('로그아웃에 실패했습니다.');
        }
    };

    if (loading) {
        return (
            <div className="mypage">
                <h2>로딩 중...</h2>
            </div>
        );
    }

    if (!user) {
        return null; // 로그인되지 않은 경우 리다이렉트 중
    }

    return (
        <div className="mypage">
            <div className="user-info">
                <h2 className="mypage-title">마이페이지</h2>
                {user.photoURL && (
                    <div className="user-avatar" style={{ textAlign: 'center' }}>
                        <img 
                            src={user.photoURL} 
                            alt="프로필 이미지" 
                            style={{
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '50%',
                                marginBottom: '20px',
                                display: 'block',
                                margin: '0 auto 20px auto'
                            }}
                        />
                    </div>
                )}
                <p>
                    <strong className="user_name">사용자명:</strong> {user.username}
                </p>
                <p>
                    <strong className="user_email">이메일:</strong> {user.email}
                </p>
                <p>
                    <strong>사용자 ID:</strong> {user.uid}
                </p>
                <div className="logout-section">
                    <button 
                        onClick={handleLogout}
                        className="logout-button"
                        style={{
                            backgroundColor: '#78509D',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '20px'
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Mypage;