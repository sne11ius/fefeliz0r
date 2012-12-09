#!/usr/bin/env python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from shlex import split
import urllib2
import cgi
#from pyquery import PyQuery
from rebase import rebase, rebase_links

PORT_NUMBER = 8080
OWN_URL = 'http://localhost:8080/'

class myHandler(BaseHTTPRequestHandler):
    def fixJS(self, html):
        f = open('ajaxFixer.js', 'r')
        script = '<script>' + f.read() + '</script>'
        insert_position = html.find('</title>') + 8 
        html = html[:insert_position] + script + html[insert_position + 1:]
        return html
    
    def makeHtml(self, stuff):
        return '<html><body>' + cgi.escape(str(stuff)) + '<body></html>'
    
    def do_GET(self):
        url = split(self.requestline)[1][1:]
        try:
            self.headers['Referer']
            f = open('no_referer.html', 'r')
            self.wfile.write(f.read())
            return
        except:
            pass
        try:
            req = urllib2.urlopen(url)
            content = req.read()
            encoding=req.headers['content-type'].split('charset=')[-1]
            try:
                content = unicode(content, encoding)
            except:
                print 'Unknown encoding: ' + encoding
            req.close()
            self.send_response(200)
            try:
                self.send_header('Content-type',req.headers['content-type'])
            except:
                self.send_header('Content-type',req.headers['text/html'])
            self.end_headers()
            content = rebase(url, content)
            content = rebase_links(OWN_URL, content)
            content = self.fixJS(content)
            try:
                self.wfile.write(content.encode(encoding))
            except (Exception, LookupError) as e:
                try:
                    self.wfile.write(content.encode('CP-1252'))
                except (Exception, LookupError) as e:
                    self.wfile.write(content)
        except Exception as e:
            self.wfile.write(self.makeHtml(e))
            pass
        return
    
if __name__ == '__main__':
    try:
        server = HTTPServer(('', PORT_NUMBER), myHandler)
        print 'Started httpserver on port ' , PORT_NUMBER
        
        server.serve_forever()
    
    except KeyboardInterrupt:
        print '^C received, shutting down the web server'
        server.socket.close()
    