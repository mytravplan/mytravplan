
'use client'
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import { useEffect, useState } from 'react';

const Transferslider = ({ slug }) => {

  let [data, setData] = useState([])
  let api = EXPORT_ALL_APIS()

  let fetchBlogInnerPage = async () => {
    let resp = await api.loadSingleTransfer(slug)
    setData(resp?.result)
  }

  useEffect(() => {
    fetchBlogInnerPage()
  }, [])
  return (

    <div className="transfer-innerpage">
      <h2>{slug}</h2>


      <div className="t_o_wrapper">
        <div className="transfer_outer t_one">
          {data?.transfer_galleries?.slice(0, 1)?.map((e, i) => {
            return <div className="transfer_imgs t_i_one" key={i}>
              <div className="transfer-image-container">
                <img src={e|| null} alt="Image 3" />
              </div>
            </div>
          })}
        </div>

        <div className="transfer_outer t_second">
          {data?.transfer_galleries?.slice(1, 3)?.map((e, i) => {
            return <div className="transfer_imgs t_i_two" key={i}>
              <div className="transfer-image-container">
                <img src={e|| null} alt="Image 3" />
              </div>
            </div>
          })}
        </div>
      </div>



    </div>
  );
};


export default Transferslider;
