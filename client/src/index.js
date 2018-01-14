import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import ControlPanel from './components/control-panel';
import DisplayPanel from "./components/display-panel";
import { SpeechToText } from 'watson-speech';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = { transcriptionType: null, transcriptionResponse: [], token: '', error: null, labelSpeaker: false };

        //Bind methods to the component
        this.getApiToken = this.getApiToken.bind(this);
        this.getTranscriptionOptions = this.getTranscriptionOptions.bind(this);
        this.transcibeFile = this.transcibeFile.bind(this);
        this.validateFile = this.validateFile.bind(this);
        this.transcribeFromMic = this.transcribeFromMic.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.updateStateWithData = this.updateStateWithData.bind(this);
        this.stopTranscription = this.stopTranscription.bind(this);
        this.reset = this.reset.bind(this);
        this.toggleSpeakerLabeling = this.toggleSpeakerLabeling.bind(this);
        this.getLatestTranscriptionResponse = this.getLatestTranscriptionResponse.bind(this);
        this.getFinalTranscriptionResponse = this.getFinalTranscriptionResponse.bind(this);
        this.getResponse = this.getResponse.bind(this);
    }

    componentDidMount() {
        this.getApiToken()
    }

    getApiToken() {
        return fetch('/v1/api/getToken').then((res) => {
            if (res.status !== 200) {
                this.setState({ error: 'Error retrieving auth token' })
                return;
            }
            return res.text();
        }).then(token => this.setState({ token })).catch(this.handleError);
    }

    getTranscriptionOptions(extras) {
        return Object.assign({
            token: this.state.token,
            objectMode: true,
            interim_results: true,
            resultsBySpeaker: this.state.labelSpeaker,
            model: 'en-US_NarrowbandModel',
            realtime: false,
        }, extras);
    }

    transcibeFile(userFile) {

        const file = this.validateFile(userFile);

        if (this.state.transcriptionType === 'user-file') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ transcriptionType: 'user-file' });

        this.handleResponse(SpeechToText.recognizeFile(this.getTranscriptionOptions({ file: file, play: true })));
    }

    validateFile(file) {

        if (!file) {
            this.setState({ error: 'Please select a valid file' })
            return;
        }

        return file
    }

    transcribeFromMic() {
        if (this.state.transcriptionType === 'microphone') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ transcriptionType: 'microphone' });

        this.handleResponse(SpeechToText.recognizeMicrophone(this.getTranscriptionOptions()));
    }

    handleResponse(stream) {

        //since this is a new incoming response, we "clear the old to give way for the new"
        if (this.stream) {
            this.stream.stop();
            this.stream.removeAllListeners();
            this.stream.recognizeStream.removeAllListeners();
        }

        this.stream = stream;

        this.stream.on('data', this.updateStateWithData);
    }

    handleError(error) {
        console.log(error);
    }

    updateStateWithData(data) {
        console.log(data);
        this.setState({ transcriptionResponse: this.state.transcriptionResponse.concat(data) });
    }

    stopTranscription() {
        if (this.stream) {
            this.stream.stop();
        }
    }

    reset() {
        if (this.state.transcriptionType) {
            this.stopTranscription();
        }
        this.setState({ transcriptionResponse: [], error: null });
    }

    toggleSpeakerLabeling() {
        this.setState({
            labelSpeaker: !this.state.labelSpeaker,
        });
    }

    getLatestTranscriptionResponse() {
        const latestResponse = this.state.transcriptionResponse[this.state.transcriptionResponse.length - 1];

        if (!latestResponse || !latestResponse.results || !latestResponse.results.length || latestResponse.results[0].final) {
            return null;
        }
        return latestResponse;
    }

    getFinalTranscriptionResponse() {
        return this.state.transcriptionResponse.filter(response => response.results &&
            response.results.length && response.results[0].final);
    }

    getResponse() {
        const finalResponse = this.getFinalTranscriptionResponse();
        const latestResponse = this.getLatestTranscriptionResponse();

        if (latestResponse) {
            finalResponse.push(latestResponse);
        }

        return finalResponse;
    }


    render() {
        const transcription = this.getResponse();

        return (
            <div>
                <div className="text-danger">{this.state.error ? this.state.error : ''}</div>
                <ControlPanel
                    isChecked={this.state.labelSpeaker}
                    onToggleSpeakerLabel={this.toggleSpeakerLabeling}
                    onPlayClicked={this.transcibeFile}
                    onMicClicked={this.transcribeFromMic}
                    onStopClicked={this.stopTranscription} />

                <DisplayPanel
                    transcription={transcription}
                    labelSpeaker={this.state.labelSpeaker}
                />
            </div>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.querySelector('#container'));
