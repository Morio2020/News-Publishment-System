import './App.css'
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import {store, persistor} from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
// import { useEffect } from 'react';
// import axios from 'axios'

function App() {
  // useEffect(()=>{
  //   axios.get("/ajax/moreComingList?token=&movieIds=1205957,1383307,1367251,1446115,1324996,1182552,1359726,1212472,248906,1395465&optimus_uuid=BF4CAE60EC8211EC87868F17282242140DF273CC210E4748B82EFFDD4B0B7971&optimus_risk_level=71&optimus_code=10").then(res=>{
    
  //   // /api/mmdb/movie/v3/list/hot.json?ct=%E5%A4%A9%E6%B4%A5&ci=40&channelId=4").then(res=>{
  //     // console.log(res.data)
  //   })
  // },[])
  return (

    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter/>
      </PersistGate>    
    </Provider>

  )
}

export default App;
