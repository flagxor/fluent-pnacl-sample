PNaCl Python Sample for Fluent 2015
===================================

This is a sample of using a PNaCl port of Python to implement part
of a page using Python.
It was used as a sample for this
[talk](http://fluentconf.com/javascript-html-2015/public/schedule/detail/39279).

The [difflib](https://docs.python.org/2/library/difflib.html)
library is used to produce a nice textual diff of the contents
in two textareas.

To run the sample, host on a local webserver.
For example you can use python:
  python -m SimpleHTTPServer 5103

View the result at http://localhost:5103/diff.html.

A single module is spun up which communicates with the page via
both postMessage (for console io) and DOM Filesystem access
(to transmit data files).

The
[Python](http://gsdview.appspot.com/naclports/builds/pepper_41/trunk-253-g089940f/publish/python/pnacl/)
used is from [naclports](https://code.google.com/p/naclports/).

A pared down version of a
[Python](http://gsdview.appspot.com/naclports/builds/pepper_41/trunk-253-g089940f/publish/python/pnacl/)
from our
[continuous build](http://build.chromium.org/p/client.nacl.ports/console)
is included.
Only the needed JavaScript files are included.
pydata_pnacl.tar has been pared down to remove some of the larger
libraries which are not relevant to this sample.
