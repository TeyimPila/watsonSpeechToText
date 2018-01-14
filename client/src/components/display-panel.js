import React from 'react';
import DisplayUnlabeled from './display-unlabeled';
import DisplayLabeled from './display-labeled';

const DisplayPanel = (props) => {

    if (props.transcription.length === 0) {
        return <div className="col-md-8 col-md-offset-2 display-area text-center">
            <h4>Upload a file and play or click "Use Mic" and Record</h4>
        </div>
    }

    //Renders a different view depending on whether 
    //or not a use selects the label user option
    if (props.labelSpeaker) {
        return <DisplayLabeled transcripts={props.transcription} />
    } else {
        return <DisplayUnlabeled transcripts={props.transcription} />
    }
}

export default DisplayPanel;