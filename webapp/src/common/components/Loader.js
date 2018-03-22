import React from 'react';

const Loader = ({loaderSrc, size, loadingText}) => {

    const containerStyles = {
        width: size,
        height: size
    };

    return (
        <div className="grid-noGutter-spaceAround align-center" style={containerStyles}>
            <img className={`col-12-center-bottom`} alt="Loader" src={loaderSrc}/>
            <h2 className="col-12-center message loading-label">{loadingText}</h2>
        </div>
    )
};

export default Loader;
