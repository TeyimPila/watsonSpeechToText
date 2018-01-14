import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import ControlBar from './components/search_bar';
import TranscribedText from "./components/transcribed_text";
import { SpeechToText } from 'watson-speech';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = { transcriptionResponse: [], token: '', error: null, labelSpeaker: false };
    }

    componentDidMount() {
        this.getApiToken()
    }

    getApiToken() {
        return fetch('http://localhost:3100/getToken').then((res) => {
            if (res.status !== 200) {
                throw new Error('Error retrieving auth token');
            }
            return res.text();
        }) // todo: throw here if non-200 status
            .then(token => this.setState({ token })).catch(this.handleError);
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

    transcibeFile(files) {

        const file = this.validateFile(files);

        if (this.state.audioSource === 'user-file') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ audioSource: 'user-file' });

        this.handleResponse(SpeechToText.recognizeFile(this.getTranscriptionOptions({ file: file, play: true })));
    }

    validateFile(files) {
        const file = files[0];

        if (!file) {
            this.setState({ error: 'Please select a valid file' })
            return;
        }

        return file
    }

    transcribeFromMic() {
        if (this.state.audioSource === 'microphone') {
            this.stopTranscription();
            return;
        }

        this.reset();
        this.setState({ audioSource: 'microphone' });

        this.handleResponse(SpeechToText.recognizeMicrophone(this.getTranscriptionOptions()));
    }

    // transcribeSample(linkToFile) {
    //     if (this.state.audioSource === 'sample') {
    //         this.stopTranscription();
    //         return;
    //     }

    //     this.reset();
    //     this.setState({ audioSource: 'sample' });

    //     this.handleResponse(SpeechToText.recognizeFile(this.getTranscriptionOptions({ file: linkToFile })));
    // }


    handleResponse(stream) {
        console.log(stream);

        //since this is a new incoming response, we "clear the old to give way for the new"
        if (this.stream) {
            this.stream.stop();
            this.stream.removeAllListeners();
            this.stream.recognizeStream.removeAllListeners();
        }

        this.stream = stream;

        this.strean.on('data', this.updateStateWithData).on('end', this.handleStreamEnd);
    }


    updateStateWithData(data) {
        this.setState({ transcriptionResponse: this.state.transcriptionResponse.concat(data) });
    }

    stopTranscription() {
        if (this.stream) {
            this.stream.stop();
        }
    }

    reset() {
        if (this.state.audioSource) {
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
                <ControlBar />
                <TranscribedText />
            </div>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.querySelector('#container'));
