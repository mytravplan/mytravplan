'use client'
import useFetchAllSections from "@/hooks/useLoadApiHook";

const { default: LoadingBar } = require("@/app/_common/innerLoader/innerLoader")




const Bloggallery = ({ data }) => {

    let response = useFetchAllSections()

    let { footer = {} } = response.data



    let result = data ? data.result : []
    return (
        <>
            {result === undefined || result === null || result === 0 ? <div className='overview blog-inner-page' style={{ marginTop: '20px' }}><LoadingBar /></div> : (result.map((ele) => {
                return <div className='overview blog-inner-page' key={ele._id} >

                    <div className='summary_slider'>
                        <div className="itinerary_inner">
                            <div className='itenary_contact'>
                                <div className='top_summary'>
                                    <div className='top_summary_inner'>
                                        <h2 className='heading_inner_page'>Top Summary</h2>
                                        <p>{ele.blog_overview}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='right_query'>
                                <div className='card_contact'>

                                    <div className='question'>
                                        <h1>Have a Question?</h1>
                                        <p>Do not hesitage to give us a call. We are an expert team and we are happy to talk to you</p>
                                        <div className='contact_card'>
                                            {footer?.phoneNumbers?.map((e, index) => {
                                                return <a href={`tel:+91 ${e}`} key={index}>{e}</a>
                                            })}
                                            {footer?.emailAddresses?.map((e, index) => {
                                                return <a href={`mailto: ${e}`} key={index}>{e}</a>

                                            })}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }))}

        </>


    );
}; export default Bloggallery;