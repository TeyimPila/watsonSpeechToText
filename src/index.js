import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import ControlBar from './components/search_bar';
import TranscribedText from "./components/transcribed_text";
import { SpeechToText } from 'watson-speech';
import { AuthorizationV1, SpeechToTextV1 } from 'watson-developer-cloud';

// Text-to-speech Credentials: Supposed to be stored as environment variables
const USER_NAME = '0125826b-2f5d-4365-8546-bd6830adc6e6';
const PASSWORD = 'dPRSipKFpTNb';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = { transciptionData: [], token: '', error: null, labelSpeaker: false };
        this.transcribeAudio(null);
        this.stopTranscription();
    }

    componentDidMount() {
        this.getApiToken()
    }

    getApiToken() {
        let authorization = new AuthorizationV1({
            username: USER_NAME,
            password: PASSWORD,
            url: SpeechToTextV1.URL
        });


        authorization.getToken(function (error, token) {
            if (token) {
                this.setState({ token });
            } else {
                this.setState({ error });
                throw new Error('Oops! There was an error retrieving the token');
            }
        });
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
        this.setState({ transciptionData: this.state.transciptionData.concat(data) });
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
        this.setState({ transciptionData: [], error: null });
    }

    toggleSpeakerLabeling() {
        this.setState({
            labelSpeaker: !this.state.labelSpeaker,
        });
    }


    getLatestResponse() {
        const latest = this.state.formattedMessages[this.state.formattedMessages.length - 1];

    }












    /**
     * Renders component on DOM
     */
    render() {
        return (
            <div>
                <ControlBar />
                <TranscribedText />
            </div>
        );
    }
}


ReactDOM.render(<App />, document.querySelector('#container'));
