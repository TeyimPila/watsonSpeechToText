import React, { Component } from 'react';

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = { file: '' }
    }

    render() {
        return (
            <div className="col-md-8 col-md-offset-2">
                <input
                    type="file"
                    className="form-control search-bar"
                    onChange={event => this.setState({ file: event.target.files[0] })}
                />

                <div className="input-group control-buttons">
                    <button onClick={event => this.onPlayClicked(this.state.file, 0)} className="btn btn-secondary">Play</button>
                    <button onClick={event => this.props.onStopClicked(event)} className="btn btn-secondary">Stop</button>
                    <button onClick={event => this.onPlayClicked(this.state.file, 1)} className="btn btn-secondary">Use Mic</button>
                </div>
                <hr></hr>
            </div>
        )
    }

    /**
     * Handles onClick event on the play button and calls the 
     * callback that initiates transcription in index.js
     * 
     * @param {audio file} audio 
     * @param {transcription method: 1|0} type 
     */
    onPlayClicked(audio, type = 0) {
        this.props.onAudioUpload({ audio: audio, type: type });
    }
}

export default SearchBar;
