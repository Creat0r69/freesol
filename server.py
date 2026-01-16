from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse
import os

class SimpleHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            with open('index.html', 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

    def do_POST(self):
        if self.path == '/submit':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = urllib.parse.parse_qs(post_data.decode('utf-8'))
            address = data.get('address', [''])[0]
            captcha = data.get('recaptcha_response_field', [''])[0]
            
            if address and captcha and captcha != 'manual_challenge':
                with open('addresses.txt', 'a') as f:
                    f.write(address + '\n')
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'<h1>Success! 5 SOL sent to ' + address.encode() + b'</h1><a href="/">Back</a>')
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b'Invalid input')
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not Found')

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), SimpleHandler)
    print('Server running on http://localhost:8000')
    server.serve_forever()