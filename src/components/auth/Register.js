import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import CustomInput from '../form/CustomInput'

export default function Register() {

    // react-hook-form config, watch password for exact value
    const { control, handleSubmit, formState: { }, watch } = useForm();
    const password = useRef({});
    password.current = watch("password", "");

    //  error message to display to user, global context function to update logged in user, router-dom navigation method
    const [error, setError] = useState('')
    const { getLoggedIn } = useContext(AuthContext)
    const navigate = useNavigate()

    // register with credentials from react-hook-form
    const register = async (data) => {
        try {
            const registerData = {
                name: data.name,
                email: data.email,
                password: data.password,
            }
            await axios.post("https://dreamy.onrender.com/auth/", registerData)
            // await axios.post("https://dreamy-journal.herokuapp.com/auth/", registerData)
            // await axios.post("http://localhost:3001/auth/", registerData)

            // update global then navigate to home
            await getLoggedIn()
            navigate('/journal')
        } catch (err) {
            let { message } = err.response.data.err
            // change the error message
            if (message === 'A user with the given username is already registered') {
                message = 'This email is already registered.'
            }
            setError(message)
        }
    }

    // google login
    const loginGoogle = () => {
        window.open('https://dreamy.onrender.com/auth/google', '_self')
        // window.open('https://dreamy-journal.herokuapp.com/auth/google', '_self')
        // window.open('http://localhost:3001/auth/google', '_self')
    }

    // get jwt token from apo then navigate to the 'journal' page
    const getToken = async () => {
        try {
            const res = await axios.get('https://dreamy.onrender.com/auth/login/success')
            // const res = await axios.get('https://dreamy-journal.herokuapp.com/auth/login/success')
            // const res = await axios.get('http://localhost:3001/auth/login/success')
            if (res.status === 200) {
                await getLoggedIn()
                navigate('/journal')
            }
            throw new Error('authentication has failed')
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        getToken()
    }, [])

    return (
        <Container fluid className='d-flex align-items-center justify-content-center register-container'>
            <Row>
                <Form onSubmit={handleSubmit(register)}>
                    <h1 className='mb-5'>Register a new account</h1>
                    {error && <p>{error}</p>}
                    <CustomInput
                        name="name"
                        placeholder="Name"
                        control={control}
                        rules={{
                            required: "Name is Required",
                            pattern: {
                                value: /^[A-Za-z- ]+$/,
                                message: 'No numbers in names please '
                            }
                        }}
                    />
                    <CustomInput
                        name="email"
                        placeholder="Email"
                        control={control}
                        rules={{
                            required: "Email is Required",
                            pattern: { value: /(.+)@(.+){2,}\.(.+){2,}/, message: 'Please enter valid email.' }
                        }}
                    />
                    <CustomInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        control={control}
                        rules={{
                            required: "Password is Required",
                            minLength: { value: 8, message: "Passwords must be more than 8 characters" }
                        }}
                    />
                    <CustomInput
                        name="verifyPassword"
                        type="password"
                        placeholder="Verify your Password"
                        control={control}
                        rules={{
                            required: "Please verify your password",
                            validate: value =>
                                value === password.current || "The passwords do not match"
                        }}
                    />
                    <Button className='w-100 ' variant='success' type="submit">Register</Button>

                    <hr />
                    <Button className=" w-100 mb-3 btn-google" onClick={loginGoogle}>
                        Register with Google <span className='fa fa-google' />
                    </Button>

                    <div className='d-flex justify-content-center'>
                        <p>have an account? <Link className='auth-link' to='/'>Log In</Link> </p>
                    </div>
                </Form>
            </Row>
        </Container>
    )
}
