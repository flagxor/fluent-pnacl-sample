'use strict';

var mgr = new NaClProcessManager();
var pending = false;
var running = false;

function run(nmf, cmd, callback) {
  mgr.spawn(
      nmf, cmd, [
        'PYTHONHOME=/lib/python2.7',
        'PYTHONPATH=/lib/python2.7',
      ], '/', 'pnacl', null,
      function(pid) {
    callback();
  });
}

function fileURL(filename) {
  return 'filesystem:' + location.origin + '/temporary/' + filename;
}

function runDiff(callback) {
  prepDiff(function() {
    run('python.nmf',
        ['python.nmf', '/tmp/diff.py',
        '/tmp/before.txt',
        '/tmp/after.txt',
        '/tmp/out.html'], callback);
  });
}

function setOutput(data) {
  document.getElementById('diff').innerHTML = data;
}

window.requestFileSystem = window.requestFileSystem ||
                           window.webkitRequestFileSystem;

function writeFile(data, filename, callback) {
  window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
    fs.root.getFile(filename, {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          var blob = new Blob([data], {type: 'text/plain'});
          fileWriter.onwriteend = function(e) {
            callback();
          };
          fileWriter.write(blob);
        }
        fileWriter.truncate(0);
      });
    });
  });
}

function httpGet(url, callback) {
  var r = new XMLHttpRequest();
  r.open('GET', url, true);
  r.onreadystatechange = function() {
    if (r.readyState === 4) {
      if (r.status === 200) {
        callback(r.responseText);
      } else {
        callback(null);
      }
    }
  };
  r.send();
}

function prepDiff(callback) {
  httpGet('diff.py', function(data) {
    writeFile(data, 'diff.py', callback);
  });
}

function updateDiff() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  var before = document.getElementById('before').value;
  var after = document.getElementById('after').value;
  writeFile(before, 'before.txt', function() {
    writeFile(after, 'after.txt', function() {
      mgr.setStdoutListener(function() {
        httpGet(fileURL('out.html'), function(data) {
          setOutput(data);
          running = false;
          if (pending) {
            pending = false;
            updateDiff();
          }
        });
      });
      mgr.sendStdinForeground('\n');
    });
  });
}

window.onload = function() {
  runDiff(function() {
    var before = document.getElementById('before');
    before.addEventListener('input', updateDiff, false);
    var after = document.getElementById('after');
    after.addEventListener('input', updateDiff, false);
    updateDiff();
  });
};
