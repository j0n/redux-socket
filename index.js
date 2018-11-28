'use strict';
let socket;
let reconnectCount = 0
let store;
let state = 0;
let que = [];
const handleQue = () => {
    if (que.length > 0) {
        const item = que.pop();
        if (send(item.type, item.data)) {
            setTimeout(handleQue, 400);
        }
    }
}
const SOCKET_OPENED = 'SOCKET_OPENED';
const SOCKET_CLOSED = 'SOCKET_CLOSED';
const SOCKET_ERROR = 'SOCKET_ERROR';
// should be an middleware



export const connect = (host, _store) => {
    store = _store;
    const newSocket = new WebSocket(host);
    newSocket.addEventListener('open', function (event) {
        reconnectCount = 0;
        state = 1;
        store.dispatch({ type: SOCKET_OPENED });
        handleQue();
    });
    newSocket.addEventListener('close', function (event) {
        state = 0;
        store.dispatch({ type: SOCKET_CLOSED });
        reconnect();
    });
    newSocket.addEventListener('error', function (error) {
        state = 0;
        store.dispatch({ type: SOCKET_ERROR, error });
    })
    newSocket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if (data.code !== 404) {
            store.dispatch(data);
        }
    });
    socket = newSocket;
}

const reconnect = () => {
    setTimeout(() => {
        connect(store);
    }, reconnectCount * 100)
}

export const send = (type, data = {}, preventInternalDispatch = false) => {
    if (!preventInternalDispatch) {
        store.dispatch({ type, data });
    }
    const { user = {} } = store.getState();
    const { token = false } = user;
    data.token = token;
    if (state !== 0) {
        socket.send(JSON.stringify({ type, data }));
        return true;
    } else {
        que.push({ type, data });
        return false;
    }
}
export const getSocketState = () => state
