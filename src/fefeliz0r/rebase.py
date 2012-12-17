#!/usr/bin/env python

# took from & thanks to: http://a3nm.net/blog/htmlrebase.html

"""Resolve relative links in an HTML blob according to a base"""
from bs4 import BeautifulSoup
import sys
import urlparse

# source: http://stackoverflow.com/q/2725156/414272
# TODO: "These aren't necessarily simple URLs ..."
targets = [
    ('a', 'href'), ('applet', 'codebase'), ('area', 'href'), ('base', 'href'),
    ('blockquote', 'cite'), ('body', 'background'), ('del', 'cite'),
    ('form', 'action'), ('frame', 'longdesc'), ('frame', 'src'),
    ('head', 'profile'), ('iframe', 'longdesc'), ('iframe', 'src'),
    ('img', 'longdesc'), ('img', 'src'), ('img', 'usemap'), ('input', 'src'),
    ('input', 'usemap'), ('ins', 'cite'), ('link', 'href'),
    ('object', 'classid'), ('object', 'codebase'), ('object', 'data'),
    ('object', 'usemap'), ('q', 'cite'), ('script', 'src'), ('audio', 'src'),
    ('button', 'formaction'), ('command', 'icon'), ('embed', 'src'),
    ('html', 'manifest'), ('input', 'formaction'), ('source', 'src'),
    ('video', 'poster'), ('video', 'src'),
]

targets_links = [
    ('a', 'href')
]

def rebase_one(base, url, force_rebase):
    """Rebase one url according to base"""
    parsed = urlparse.urlparse(url)
    if parsed.scheme == parsed.netloc == '':
        return urlparse.urljoin(base, url)
    elif force_rebase:
        return base + url
    else:
        return url

def rebase(base, soup):
    """Rebase the HTML blob data according to base"""
    for (tag, attr) in targets:
        for link in soup.findAll(tag):
            try:
                url = link[attr]
            except KeyError:
                pass
            else:
                link[attr] = rebase_one(base, url, False)
    return soup

def rebase_links(base, soup):
    """Rebase _all_ 'a' links in the HTML blob data according to base"""
    for (tag, attr) in targets_links:
        for link in soup.findAll(tag):
            try:
                url = link[attr]
            except KeyError:
                pass
            else:
                if link[attr] != 'javascript:void(0);':
                    link[attr] = rebase_one(base, url, True)
    return soup

if __name__ == '__main__':
    try:
        base = sys.argv[1]
    except IndexError:
        print >> sys.stderr, "Usage: %s BASEURL" % sys.argv[0]
        sys.exit(1)
    data = sys.stdin.read()
    print rebase(base, data)
