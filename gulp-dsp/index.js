var Stream = require("stream"),
	Path = require("path");

function getInclude(str){
    return (''+str).replace(/include/,'').replace(/\s/g,'')
}
function getFooter(footer){
   var prex = footer ?footer : 'default';
   return '<&include file="ui-template/include/footer.'+prex+'.html" inline&>'
}
function getHeader(header){
    var prex = header ? header : 'default';
    return '<&include file="ui-template/include/header.'+prex+'.html" inline&>';
}



function dsp() {
	"use strict";
  var stream = new Stream.Transform({objectMode: true});
  stream._transform = function(file, unused, callback) {
      var buffer = file._contents,
          text = buffer.toString();

      text = text.replace(/\/\/[^\n]+]/g,'')
          .replace(/[\t\n]/ig,'')
          .replace(/\s+/g,' ')
          .replace(/\/\*.*\*\//g,'');
      //var files = buffer.toString().replace(/[\t\n]/ig,'').replace(/\s+/ig,' '),

      var content = text.match(/<!--START.*<!--END-->/igm),
          header,footer;
      if ( content ) {
          content = content[0];

          header = content.match(/<!--START([^-]*)-->/i);
          footer = content.match(/<!--END([^-]*)-->/i);

          if ( header && footer ) {
                header = getInclude(header[1]);
                footer = getInclude(footer[1]);

                content = content.replace(/<!--([^-]*)-->/ig,'');
                content = getHeader(header)+content;
                content += getFooter(footer);
          }
          //写默认数据
          content = content.replace(/<script[^>]*>/,'<script>var config=<&json_encode($tdata)&>||{};')
          var buffer = new Buffer(content,'utf-8');

          file._contents = buffer;
      }
      callback(null,file);
	}

	return stream;
};

module.exports = dsp;

