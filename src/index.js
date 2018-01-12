import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import SearchBar from './components/search_bar';
import TranscribedText from "./components/transcribed_text";
import { SpeechToText } from 'watson-speech';
import { AuthorizationV1, SpeechToTextV1 } from 'watson-developer-cloud';

// Text-to-speech Credentials: Supposed to be stored as environment variables
const USER_NAME = '0125826b-2f5d-4365-8546-bd6830adc6e6';
const PASSWORD = 'dPRSipKFpTNb';

let stream = null

class App extends Component {

    constructor(props) {
        super(props);

        this.state = { response: '', audio: null, stream: stream };
        this.transcribeAudio(null);
        this.stopTranscription();
    }

    /**
     * This method retrieves an authorization token and 
     * uses it to perfrom API calls for transction using audio and type keys
     * provided in props object.
     * 
     * @param {audio: file, type: transcription type} props 
     */
    transcribeAudio(props) {

        if (props !== null && (props.type === 1 || props.type === 0)) {

            if (this.state.stream) {
                this.setState({ response: '', audio: null })
                this.state.stream.stop()
            }

            let authorization = new AuthorizationV1({
                username: USER_NAME,
                password: PASSWORD,
                url: SpeechToTextV1.URL
            });

            authorization.getToken(function (error, token) {
                if (token) {
                    if (props.type === 1) {
                        stream = SpeechToText.recognizeMicrophone({
                            token: token,
                            model: 'en-US_NarrowbandModel',
                            realtime: false,
                        })
                    } else {
                        stream = SpeechToText.recognizeFile({
                            token: token,
                            file: props.audio,
                            model: 'en-US_NarrowbandModel',
                            realtime: false, // don't slow down the results if transcription occurs faster than playback
                            play: true
                        })
                    }

                    this.setState({ stream })

                    stream.on('data', function (data) {
                        const text = data.toString()
                        this.setState({ response: this.state.response += text })
                    }.bind(this))

                } else {
                    console.log('Error: ', error);
                }
            }.bind(this));
        }
    }


    /**
     * Stops the stream and reset state variables 
     * when stop button is pressed.
     */
    stopTranscription() {
        if (this.state.stream) {
            this.state.stream.stop()
            this.setState({ audio: null, stream: null })
        }
    }

    /**
     * Renders component on DOM
     */
    render() {
        return (
            <div>
                <SearchBar onAudioUpload={props => this.transcribeAudio(props)} onStopClicked={event => this.stopTranscription()} />
                <TranscribedText response={this.state.response} />
            </div>
        );
    }
}


ReactDOM.render(<App />, document.querySelector('#container'));
