import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import ControlPanel from './components/control-panel';
import DisplayPanel from "./components/display-panel";
import { SpeechToText } from 'watson-speech';


class App extends Component {

    constructor(props) {
        super(props);

        //Initialize component state.
        this.state = {
            transcriptionType: null,
            transcriptionResponse: [],
            token: '',
            error: null,
            labelSpeaker: false
        };

        //Bind methods to the class component
        this.getApiToken = this.getApiToken.bind(this);
        this.getTranscriptionOptions = this.getTranscriptionOptions.bind(this);
        this.transcibeFile = this.transcibeFile.bind(this);
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

    //Immediate component mounts, go fetch token
    componentDidMount() {
        this.getApiToken()
    }

    /**
     * Makes api call to the server (nodeJS/Express),
     * fetches a token and stores in state.
     */
    getApiToken() {
        return fetch('/v1/api/getToken').then((res) => {
            if (res.status !== 200) {
                this.setState({ error: 'Error retrieving auth token' })
                return;
            }
            return res.text();
        }).then(token => this.setState({ token })).catch(this.handleError);
    }

    /**
     * This method returns options that will be 
     * used for making the transcription API call
     * 
     * @param {object: additional params} extras 
     */
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

    /**
     * Takes a file (upload) and uses it for transcription
     * 
     * @param {file} userFile 
     */
    transcibeFile(userFile) {

        if (!userFile) {
            this.setState({ error: 'Please select a valid file' })
            return;
        }

        if (this.state.transcriptionType === 'user-file') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ transcriptionType: 'user-file' });

        this.handleResponse(SpeechToText.recognizeFile(this.getTranscriptionOptions({ file: userFile, play: true })));
    }


    /**
     * Performs transcription by listening to microphone input
     */
    transcribeFromMic() {
        if (this.state.transcriptionType === 'microphone') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ transcriptionType: 'microphone' });

        this.handleResponse(SpeechToText.recognizeMicrophone(this.getTranscriptionOptions()));
    }

    /**
     * Takes in a new incoming stream returned, 
     * extract data from it and updates state
     * 
     * @param {transcription stream} stream 
     */
    handleResponse(stream) {

        //since this is a new incoming response, we "...clear out the old to give way for the new."
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

    /**
     * Upon successful transcription, update state with data.
     * @param {trascription data} data 
     */
    updateStateWithData(data) {
        this.setState({ transcriptionResponse: this.state.transcriptionResponse.concat(data) });
    }

    /**
     * Stops transcription if there is any in progress
     */
    stopTranscription() {
        if (this.stream) {
            this.stream.stop();
        }
    }

    /**
     * Stops streamin and clears existing data from state
     */
    reset() {
        if (this.state.transcriptionType) {
            this.stopTranscription();
        }
        this.setState({ transcriptionResponse: [], error: null });
    }

    /**
     * Toggles the label user option. 0|1. 
     */
    toggleSpeakerLabeling() {
        this.setState({
            labelSpeaker: !this.state.labelSpeaker,
        });
    }

    /**
     * Extracts the latest interin response from data stored on state.
     */
    getLatestTranscriptionResponse() {
        const latestResponse = this.state.transcriptionResponse[this.state.transcriptionResponse.length - 1];

        if (!latestResponse || !latestResponse.results || !latestResponse.results.length || latestResponse.results[0].final) {
            return null;
        }
        return latestResponse;
    }

    /**
     * gets results tagged as final.
     */
    getFinalTranscriptionResponse() {
        return this.state.transcriptionResponse.filter(response => response.results &&
            response.results.length && response.results[0].final);
    }

    /**
     * Concatenates interin responses to final responsese to produce 
     * a final response ready for display without repititions
     */
    getResponse() {
        const finalResponse = this.getFinalTranscriptionResponse();
        const latestResponse = this.getLatestTranscriptionResponse();

        if (latestResponse) {
            finalResponse.push(latestResponse);
        }

        return finalResponse;
    }


    /**
     * Render!
     */
    render() {
        const transcription = this.getResponse();

        return (
            <div>
                <div className="text-danger">{this.state.error ? this.state.error : ''}</div>

                <ControlPanel
                    isChecked={this.state.labelSpeaker}
                    onToggleSpeakerLabel={this.toggleSpeakerLabeling}
                    onPlayClicked={this.transcibeFile}
                    // onMicClicked={this.transcribeFromMic}
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
