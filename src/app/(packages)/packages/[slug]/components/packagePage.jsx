'use client'
import { EXPORT_ALL_APIS } from '@/utils/apis/api'
import React, { useEffect, useState } from 'react'
import TravelGallery from './slider'
import Itinerary from './overview'

function PackagePage({slug}) {

 
    let api = EXPORT_ALL_APIS()

  let [data, setData] = useState([])   

  let fetchSinglePackgedetails = async () => {

    let resp = await api.loadSinglePackage(slug)
    setData(resp)
  }
  useEffect(() => {
    fetchSinglePackgedetails()
  }, [])

   let result=data?data.result:[]

 
  return (
    <>
     <TravelGallery result={result}/>
     <Itinerary result={result}/>
    </>
  )
}

export default PackagePage
