import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { registerRoute } from '../utils/APIROUTES'


const Register = () => {
    const navigate = useNavigate();
    const toastOption = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmpassword: ''

    })

    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidtion()) {
            const { password, email, username } = values;

            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,

            });

            if (data.status === false) {
                toast.error(data.msg, toastOption);
                return false;
            }

            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user));
                navigate('/')

            }


        }



    }



    const handleValidtion = () => {
        const { password, confirmpassword, email, username } = values;
        if (password !== confirmpassword) {
            toast.error('password and confirm password must be same.', toastOption);
            return false;
        }
        else if (username.length < 3) {
            toast.error('Username must be grater than 3 characters.', toastOption);
            return false;
        }
        else if (password.length < 8) {
            toast.error('Password must be grater than or equal to 8 characters.', toastOption);
            return false;
        }
        else if (email === '') {
            toast.error('email is required.', toastOption);
            return false;
        }

        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));



    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>Chatty</h1>
                    </div>
                    <input
                        type="text"
                        placeholder='Username'
                        name='username'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="email"
                        placeholder='Email'
                        name='email'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        name='confirmpassword'
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Create User</button>
                    <span> Already have an account?
                        <Link to={'/login'}> Login</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`

    height: 100vh;
    width: 100vw;
    display : flex ;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
        height: 5rem;

        }  

        h1 {
            color: white;
            text-transform: uppercase;
        }

    }
  

  

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;

            }
        }

        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;
            &:hover {
                background-color: #4eBeff;
            }
        }

        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }

`;

export default Register