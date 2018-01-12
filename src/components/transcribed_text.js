import React from 'react';

const TranscribedText = ({ response }) => {

    console.log(response);
    // if (!response) {
    //     return <div>Waiting...</div>
    // }
    // const output = response.map(function (text) {

    //     return text.results.map(function (alternative) {
    //         if (alternative.speaker === 0) {
    //             let speaker = "Speaker 1 ";
    //             return alternative.alternatives.map(function (alt) {
    //                 console.log(alt)
    //                 return <li>{speaker += alt.transcript}</li>
    //             })
    // }
    // return <li>{alternative.speaker}</li>
    // console.log(alternative.speaker);
    // alternative.alternatives.map(function (alt) {
    //     // console.log(alt)
    // });

    // });
    // console.log(text)
    // })

    // if (!text) {
    //     return <div>Transcribing...</div>
    // }
    // const conversation = text.map((text) => {
    //     return <li key={text}>{text}</li>;
    // })
    return <ul className="col-md-6 list-group">'output'</ul>
}

export default TranscribedText;