import React, { Component } from 'react';

class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = { file: '' }

        // this.playFile = this.playFile.bind(this)
    }

    render() {
        return (
            <div>
                <input
                    type="file"
                    className="form-control"
                    onChange={event => this.setState({ file: event.target.files[0] })}
                />

                <div className="input-group text-center">
                    <button onClick={event => this.onPlayClicked(this.state.file, 0)} type="submit" className="btn btn-secondary">Play</button>
                    <button onClick={event => this.props.onStopClicked(event)} type="submit" className="btn btn-secondary">Stop</button>
                    <button onClick={event => this.onPlayClicked(this.state.file, 1)} type="submit" className="btn btn-secondary">Use Mic</button>

                </div>

            </div>
        )
    }

    onPlayClicked(audio, type = 0) {
        this.props.onAudioUpload({ audio: audio, type: type });
    }
}

export default SearchBar;
