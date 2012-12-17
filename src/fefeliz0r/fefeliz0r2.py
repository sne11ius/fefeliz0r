#!/usr/bin/env python
# -*- coding: utf-8 -*-

from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from shlex import split
import urllib2
import cgi
from rebase import rebase, rebase_links
#from SimpleProxy import SimpleProxy
from bs4 import BeautifulSoup
import codecs
# fuckaround for no-bug http://bugs.python.org/issue10865
from socket import getaddrinfo
getaddrinfo('www.google.com', 80)

try:
    from os import chroot as woooot
    woooot('./')
except:
    print 'cannot chroot D:'

PORT = 31337
OWN_URL = 'http://wasis.nu/mit/fefe/in/'
#PROXY_PORT = 8081
#PROXY_URL = 'http://localhost:8081'
AUGMENTATION_PROB = 0.125
AUGMENTATION_MIN_LENGTH = 8

REPLACEMENTS = [
    'PROXY_URL'
]

class myHandler(BaseHTTPRequestHandler):
    def insert_script(self, filename, html):
        f = codecs.open(filename, encoding='utf-8', mode='r')
        script = '<script type="text/javascript">' + f.read() + '</script>'
        insert_position = html.find('</title>') + 8
        html = html[:insert_position] + script + html[insert_position:]
        return html;

    def insert_remote_script(self, url, html):
        script = '<script type="text/javascript" src="' + url + '"></script>'
        insert_position = html.find('</title>') + 8
        html = html[:insert_position] + script + html[insert_position:]
        return html;
    
    def replace_vars(self, txt):
        for replacement in REPLACEMENTS:
            txt = txt.replace('$' + replacement, replacement);
        return txt
            
    
    def fixJS(self, html):
        html = self.insert_script('fbomb.js', html)
        html = self.insert_script('fefe_quotes.js', html)
        html = self.insert_script('ajaxFixer.js', html)
        html = self.insert_remote_script('https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js' , html)
        html = self.replace_vars(html)
        return html
    
    def makeHtml(self, stuff):
        return '<html><body>' + cgi.escape(str(stuff)) + '<body></html>'
    
    def do_GET(self):
        with open('fefeliz0r.log', 'a') as logfile:
            logfile.write('requested: ' + self.requestline + '\n')
        print 'requested: ' + self.requestline
        url = split(self.requestline)[1][13:]
        if '' is url or not url.startswith('http://'):
            self.wfile.write(open('no_url.html', 'r').read())
            return

        print 'url: ' + url
        
        try:
            referer = self.headers['Referer']
            if not referer.startswith(OWN_URL):
                self.wfile.write(open('no_referer.html', 'r').read())
                return
        except:
            pass
        try:
            data = None
            headers = {
                'User-Agent': 'fefeliz0r' # wikipedia will sowas D:
            }
            req = urllib2.Request(url, data, headers)
            connection = urllib2.urlopen(req)
            content = connection.read()
            connection.close()
            soup = BeautifulSoup(content)
            soup = rebase(url, soup)
            soup = rebase_links(OWN_URL, soup)
            content = soup.prettify(formatter = None).encode('utf-8')
            content = self.fixJS(content)
            self.send_response(200)
            self.send_header('Content-type','text/html;charset=utf-8')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.wfile.write(self.makeHtml(unicode(e)))
            pass
        return

if __name__ == '__main__':
    try:
        server = HTTPServer(('', PORT), myHandler)
        print 'Started httpserver on port ' , PORT
        server.serve_forever()
        '''
        proxy_server = SimpleProxy('', PROXY_PORT)
        proxy_server.main_loop()
        '''
    
    except KeyboardInterrupt:
        print '^C received, shutting the fuck up'
        server.socket.close()
