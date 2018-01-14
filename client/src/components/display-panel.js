import React from 'react';
import DisplayUnlabeled from './display-unlabeled';
import DisplayLabeled from './display-labeled';

const DisplayPanel = (props) => {
    console.log(props)
    if (props.transcription.length === 0) {
        return <div className="col-md-8 col-md-offset-2 display-area text-center">
            <h4>Upload a file and play or click "Use Mic" and Record</h4>
        </div>
    }

    // console.log(props.transcription);

    console.log(props)
    if (props.labelSpeaker) {
        console.log(props.transcription);
        return <DisplayLabeled transcripts={props.transcription} />
    } else {
        console.log(props.transcription)
        return <DisplayUnlabeled transcripts={props.transcription} />
    }
}

export default DisplayPanel;