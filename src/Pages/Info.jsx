/* eslint-disable no-unused-vars */
import React from 'react'
import '../Pages/styles/Info.css'

const Info = () => {
  return (
    <div className='flex justify-center items-center '>
      <div>          
        <div>
          <img src='../../public/logo.png' alt='Logo' className='logoSign' />
        </div>
        <div className='distanceH1'>
          <h1>Setup distance</h1>
        </div>
        <div>
          <img src='../../public/afstand.png' alt="distance" className='distanceLogo'/>
        </div>
      </div>
    </div>
  )
}

export default Info