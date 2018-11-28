# redux-socket
Quick implementation to pass on redux action to server and vice versa. Add to you redux 

# Message structure
Server structure of message
```
{
    type,
    data
}
```
## Send from server specific code
```
ws.send(JSON.stringify({
	type: ‘REDUX_ACTION’,
  data: {}
}));
```

Front end structure of message
```
   {
        type,
        data
    }
```
