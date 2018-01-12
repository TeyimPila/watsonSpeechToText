import React from 'react';

const TranscribedText = ({ response }) => {

    if (!response) {
        return <div className="col-md-8 col-md-offset-2 display-area text-center">
            <h4>Upload a file and play or click "Use Mic" and Record</h4>
        </div>
    }

    return <div className="col-md-8 col-md-offset-2 display-area">
        <div className='panel panel-default'>
            <div className='panel-heading text-center'><h3>Transcribing...</h3></div>
            <div className='panel-body'>{response}</div>
        </div>
    </div>
}

export default TranscribedText;