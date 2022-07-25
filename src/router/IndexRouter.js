import React from 'react'
import {BrowserRouter, Routes, Route, 
    // Navigate
    } from'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
// import Redirect from '../components/Redirect'
import NotFound from '../views/NotFound'
import News from '../views/news/News'
import Details from '../views/news/Details'
// import {useNavigate,} from 'react-router-dom'
export default function IndexRouter(){
    // const navigate = useNavigate()
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />}/>
                <Route path='/news' element={<News />}/>
                <Route path='/detail/:id' element={<Details/>}/>
                <Route path='/*' element={<NewsSandBox />}/>
                {/* <Route path='/' element={<NewsSandBox />}/> */}
                {/* <Route index element={<NewsSandBox />}/> */}
                {/* <Route path='*' element={<Navigate to='/home' />}/> */}
                {/* <Route path='*' element={<Redirect to='/login' />}/> */}
                <Route path='*' element={<NotFound/>}/>

                {/* <Route path='*' render={()=>
                    localStorage.getItem("token")
                    ?<NewsSandBox/>
                    :<Navigate to='/login' />}/> */}
                 {/* <Route path='*' render={()=>
                    localStorage.getItem("token")
                    ?<NewsSandBox/>
                    :
                    navigate("/login")}/> */}

            </Routes>
        </BrowserRouter>
    )
}