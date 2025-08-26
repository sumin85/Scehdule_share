import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();

        const [form, setForm] = useState({
            name: '',
            password: '',
            email: '',
        });
        
        const handleChange = (e) => {
            const {name, value} = e.target;
            setForm({...form, [name]: value});
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            try{
                await axios.post(`${process.env.REACT_APP_API_URL}/api/users`, form);
                alert('회원가입 성공');
                navigate('/login');
            }catch(error){
                console.error(error);
                alert('회원가입 실패' + (error.response?.error || error.message));
            }
        };

        return (
            <div className="register">
                <div className="register-container">
                    <h2> 회원 가입 </h2>
                    <div className="divider" />
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label htmlFor="reg-name">이름</label>
                            <input
                                id="reg-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="이름을 입력해주세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-id">아이디</label>
                            <input
                                id="reg-id"
                                type="text"
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                placeholder="아이디를 입력해주세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-password">비밀번호</label>
                            <input
                                id="reg-password"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력해주세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="reg-email">이메일</label>
                            <input
                                id="reg-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="이메일을 입력해주세요"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">회원가입</button>
                    </form>
                </div>
            </div>
        );
    };


export default RegisterPage;