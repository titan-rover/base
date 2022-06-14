const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.set('port', 4020);
app.use(express.static(__dirname + '/app'));




app.listen(app.get('port'), function(){
	console.log('Express server started on http://localhost:' + app.get('port'));
	console.log(__dirname);
});
