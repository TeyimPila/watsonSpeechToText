import React from 'react';

const DisplayLabeled = (props) => {

    //extract transcription message from a response and 
    //reduce resulting arrays to form strings that are fed into <li> tags
    const message = props.transcripts.map(transcript =>
        transcript.results.map((result, i) => (
            <li key={transcript.result_index + i}>
                <span className={`speaker-label speaker-${result.speaker}`}>
                    {typeof result.speaker === 'number'
                        ? `Speaker ${result.speaker}: `
                        : 'Finding out speaker: '}
                </span>
                <span>{result.alternatives[0].transcript}</span>
            </li>
        ))).reduce((a, b) => a.concat(b), []);


    return <div className="col-md-8 col-md-offset-2 display-area">
        <div className='panel panel-default'>
            <div className='panel-heading text-center'><h3>Transcribing...</h3></div>
            <div className='panel-body'>
                <ul>
                    {message}
                </ul>
            </div>
        </div>
    </div>

}

export default DisplayLabeled;