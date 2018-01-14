import React from 'react';

const DisplayUnlabeled = (props) => {

    const message = props.transcripts.map(transcript =>
        transcript.results.map((result, i) => (
            <span key={`result-${transcript.result_index + i}`}>
                {result.alternatives[0].transcript}
            </span>
        )),
    ).reduce((a, b) => a.concat(b), []); // the reduce() call flattens the array

    return <div className="col-md-8 col-md-offset-2 display-area">
        <div className='panel panel-default'>
            <div className='panel-heading text-center'><h3>Transcribing...</h3></div>
            <div className='panel-body'>{message}</div>
        </div>
    </div>
}

export default DisplayUnlabeled;