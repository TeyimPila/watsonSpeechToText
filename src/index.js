import ReactDOM from 'react-dom';

import React, { Component } from 'react';
import SearchBar from './components/search_bar';
import TranscribedText from "./components/transcribed_text";
import { SpeechToText, WetsonSpeech } from 'watson-speech';
import { AuthorizationV1, SpeechToTextV1 } from 'watson-developer-cloud';
import Websocket from 'react-websocket'

const USER_NAME = '0125826b-2f5d-4365-8546-bd6830adc6e6';
const PASSWORD = 'dPRSipKFpTNb';

let stream = null

class App extends Component {

    constructor(props) {
        super(props);

        this.state = { conversation: [], audio: null, stream: stream };
        this.transcribeAudio(null);
        this.stopTranscription();
    }

    transcribeAudio(props) {
        // console.log(props);

        if (props !== null && (props.type === 1 || props.type === 0)) {
            // console.log(props);

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
                            resultsBySpeaker: true, // pipes results through a SpeakerStream, and also enables speaker_labels and objectMode
                            realtime: false, // don't slow down the results if transcription occurs faster than playback
                            extractResults: true
                            // outputElement: '#output' // CSS selector or DOM Element (optional)
                        })
                    } else {
                        stream = SpeechToText.recognizeFile({
                            token: token,
                            file: props.audio,
                            extractResults: true,
                            // outputElement: '#output', // CSS selector or DOM Element (optional)
                            model: 'en-US_NarrowbandModel',
                            resultsBySpeaker: true, // pipes results through a SpeakerStream, and also enables speaker_labels and objectMode
                            realtime: false, // don't slow down the results if transcription occurs faster than playback
                            play: true
                        })
                    }

                    this.setState({ stream })

                    stream.on('data', function (data) {
                        this.setState({ conversation: this.state.conversation.concat(data) })
                    }.bind(this))

                } else {
                    console.log('Error: ', error);
                }
            }.bind(this));
        }
    }

    stopTranscription() {
        if (this.state.stream) {
            this.state.stream.stop()
            this.setState({})
        }
    }

    render() {
        return (
            <div>
                <SearchBar onAudioUpload={props => this.transcribeAudio(props)} onStopClicked={event => this.stopTranscription()} />
                <TranscribedText response={this.state.conversation} />
                {/* <div id="output"></div> */}
            </div>
        );
    }
}


ReactDOM.render(<App />, document.querySelector('#container'));
