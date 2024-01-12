# jsbrowser
 jquery and express routing test, uses bootstrap CSS, and bootstrap-icons offline distributions.

## About

This small footprint filemanager app - server and client - demonstrates how to traverse in the server's side filesystem from WEB client.
The filemanager's list contains directory entries from the server's filesystem. By default the root directory is the
same as the server application's working directory - but it can be set whatever else *(existing and readable by the user who runs the code on the server)* path.

The list will start a link to the parent directory **..**, then the remaining directory entries from the remote filesystem.
If the list contains direcories, clicking on them the filemanager will send a new query to the server to obtain the selected
directory contents if any.

```
_________________________________________
..
[DIR] DIR001
[DIR] DIR002
FILE001
FILE002
...
```
> How does the list look like. On the top the backlink, then directories - alphabetic order - finally files same order as the directories.

As per now the click on files does nothing - the app is highly extendible with various extra and usefull features.
## Update: 24/12/01: download works for files.
> Update 241201: clicking on the file, the Express' ***res.download()*** function transfers the file at the path as an 'attachment'. There is no streaming yet, but as I told you folks, there are a lot of room for various inventions, improvemnts and so forth. So, let's code!

The main goal was to present a web based filemanager with ExpressJS support which does not use any not necessary redirections - or very limited and proxy safe 
redirections only - but AJAX queries with parameters *see below the code fragment*.

### How the /files query is going to be sent from the browser?
```javascript
   ...
   $.get(
      '/files',
      {
          path: <path of the selected directory entry from the list>
          // [,WhatEverKey: WhatEverValue(s)... if necessary for the server side app. ]
      },
      function(data) {
         // do whatever want at this phase with the data
         // in my code this time I just empty the list container and not refresh its
         // content with the new data...I'd like to be sure if every data's arrived correctly.
      }).done(data => {
         // catche the final result here and deal with it
         // this is where I start to use the result to refresh the file list
      }).fail(failure => {
         // deal with the failure if any....
      });
   ...
```
> The code fragment above demonstrates how jQuery.ajax(...) call used to send new queries to the server.

### How the router middleware will deal with the query parameters?

At the server's router middleware expects query params in the ***req.query*** object.
```javascript
   router.get('/files', ...., async function(req, res) {
        ...
        let params = req.query;
        let qpath = params?.path;
        ...
   });
```
> The server side router middleware will obtain query params from ***req.query*** object attribute.

Feel free to comment or modify, improve the demo.

*-zg-*
