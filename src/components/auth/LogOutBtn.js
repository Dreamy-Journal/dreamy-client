import axios from 'axios'
import React, { useContext } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

export default function LogOutBtn() {
    const navigate = useNavigate()
    // update global loggedIn variable
    const { getLoggedIn } = useContext(AuthContext)

    // clear the cookie
    const logOut = async () => {
        await axios.get('https://dreamy.onrender.com/auth/logout')
        // await axios.get('http://localhost:3001/auth/logout')
        // await axios.get('https://dreamy-journal.herokuapp.com/auth/logout')
        await getLoggedIn()
        navigate('/')

    }

    return (
        <Button variant='danger' onClick={logOut}>Log out</Button>
    )
}
