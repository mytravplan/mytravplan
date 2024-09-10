import React from 'react'

function Inclusions({ packagesInclude, packagesExclude }) {
    return (
        <>
            <div>
                <h3>Inclusions & Exclusions</h3>
                <h4>Inclusion</h4>
                {packagesInclude === null || packagesInclude === undefined ? ('no result found') : (
                    packagesInclude.map((ele) => {
                        return <ul key={ele._id}>
                            <li>{ele.description}</li>
                        </ul>

                    })
                )}

                <h4>Exclusion</h4>

                {packagesExclude === null || packagesExclude === undefined ? ('no result found') : (
                    packagesExclude.map((ele) => {
                        return <ul key={ele._id}>
                            <li>{ele.description}</li>
                        </ul>

                    })
                )}
            </div>
        </>
    )
}

export default Inclusions
