import React, { Component } from 'react';

class ControlPanel extends Component {

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
                    <button onClick={event => this.props.onPlayClicked(this.state.file)} className="btn btn-secondary">Play</button>
                    <button onClick={event => this.props.onStopClicked(event)} className="btn btn-secondary">Stop</button>
                    <button onClick={event => this.props.onMicClicked(this.state.file)} className="btn btn-secondary">Use Mic</button>
                </div>
                <hr></hr>
            </div>
        )
    }


}

export default ControlPanel;
