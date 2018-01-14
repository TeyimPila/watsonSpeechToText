import React, { Component } from 'react';

class ControlPanel extends Component {

    constructor(props) {
        super(props);
        this.state = { file: null }
    }

    render() {
        return (
            <div className="col-md-8 col-md-offset-2">

                <input
                    type="file"
                    accept="audio/wav, audio/mp3, audio/mpeg, audio/l16, audio/ogg, audio/flac, .mp3, .mpeg, .wav, .ogg, .opus, .flac"
                    className="form-control search-bar"
                    onChange={event => this.setState({ file: event.target.files[0] })}
                />

                <div className="input-group control-buttons">
                    <input
                        checked={this.props.isChecked}
                        className="btn checkbox"
                        type='checkbox'
                        id='toggle-speaker-label'
                        onChange={event => this.props.onToggleSpeakerLabel(event)} />

                    <label htmlFor='toggle-speaker-label'>Label Speaker</label>
                </div>

                <div className="input-group control-buttons">
                    <button onClick={event => this.props.onPlayClicked(this.state.file)} className="btn btn-secondary">Play</button>
                    <button onClick={event => this.props.onStopClicked(event)} className="btn btn-secondary">Stop</button>
                    <button onClick={event => this.props.onMicClicked(event)} className="btn btn-secondary">Use Mic</button>
                </div>

                <div className="input-group control-buttons">
                    <small className="text-info">NOTE: The microphone feature is not supported on Safari. Try it on Google Chrome.</small>
                </div>
                <hr></hr>
            </div>
        );
    }
}

export default ControlPanel;
