import {call, take, put, race} from "redux-saga/effects";
import {eventChannel} from "redux-saga";
import commonActions, {commonActionTypes} from "../actions/commonActions";


export default function* webSocketWatcher() {
    while (true) {
        const data = yield take(commonActionTypes.INIT_WEB_SOCKET);
        yield connectToWebSocketServer(data.payload);
    }
}

function* connectToWebSocketServer(socketConnectionString) {
    const webSocket = new WebSocket(socketConnectionString);
    const webSocketChannel = yield call(watchMessages, webSocket);

    const {cancel} = yield race({
        task: [
            call(webSocketChannelListener, webSocketChannel)
        ],
        cancel: take(commonActionTypes.CLOSE_WEB_SOCKET)
    });

    if (cancel) {
        webSocketChannel.close();
    }
}

const watchMessages = socket => {
    return eventChannel(emitter => {
        socket.onopen = () => {
            socket.send('Connection established');
        };

        socket.onmessage = message => {
            webSocketActionsHandler(JSON.parse(message.data), emitter)
        };

        return () => {
            socket.close();
        }
    })
};


function* webSocketChannelListener(webSocketChannel) {
    while (true) {
        const action = yield take(webSocketChannel);
        yield put(action);
    }
}

const webSocketActionsHandler = (data, dispatch) => {
    switch (data['ACTION_TYPE']) {
        case commonActionTypes.NEW_TWEET:
            dispatch(commonActions.setNewTweet(data));
            break;
        case commonActionTypes.NEW_NOTIFICATION:
            dispatch(commonActions.setAddToastMessage({text: data.message}));
            break;
        default:
            return
    }
};
